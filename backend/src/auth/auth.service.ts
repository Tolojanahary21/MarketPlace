import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import {
  OtpType,
  User,
} from '@prisma/client';

import {
  comparePassword,
  hashPassword,
} from '../../utils/hash.util';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/dto/users.service';
import { OtpService } from './otp.service';
import { MailService } from './mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  // =========================================================
  // VALIDATE USER
  // =========================================================

  /**
   * Vérifie les identifiants d'un utilisateur.
   *
   * Utilisée par login() et éventuellement
   * par une LocalStrategy.
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const normalizedEmail =
      email.trim().toLowerCase();

    const user =
      await this.usersService.findByEmail(
        normalizedEmail,
      );

    if (!user) {
      return null;
    }

    // Vérifier le statut
    if (user.statut !== 'ACTIF') {
      return null;
    }

    // Vérifier le mot de passe
    const passwordValid =
      await comparePassword(
        password,
        user.password,
      );

    if (!passwordValid) {
      return null;
    }

    return user;
  }


  // =========================================================
  // LOGIN
  // =========================================================

  /**
   * Connecte un utilisateur et génère un JWT.
   *
   * Conditions :
   * - email correct
   * - mot de passe correct
   * - compte actif
   * - email vérifié
   */
  async login(
    email: string,
    password: string,
  ) {
    // -------------------------------------------------------
    // 1. Vérifier email + mot de passe
    // -------------------------------------------------------

    const user =
      await this.validateUser(
        email,
        password,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Email ou mot de passe incorrect.',
      );
    }

    // -------------------------------------------------------
    // 2. Vérifier que l'email est vérifié
    // -------------------------------------------------------

    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Votre adresse email n’est pas encore vérifiée. Veuillez vérifier votre email avant de vous connecter.',
      );
    }

    // -------------------------------------------------------
    // 3. Générer le JWT
    // -------------------------------------------------------

    const accessToken =
      await this.generateToken(user);
    const refreshToken =
      await this.generateRefreshToken(user);
    // -------------------------------------------------------
    // 4. Retourner la réponse
    // -------------------------------------------------------

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: this.sanitizeUser(user),
    };
  }



  // =========================================================
  // GENERATE TOKEN
  // =========================================================

  /**
   * Génère le JWT d'authentification.
   */
  async generateToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.signAsync(
      payload,
    );
  }

  // =========================================================
  // ME
  // =========================================================

  /**
   * Retourne l'utilisateur actuellement
   * connecté.
   *
   * userId provient du JWT.
   */
  async me(userId: number) {
    const user =
      await this.usersService.findById(
        userId,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Utilisateur introuvable.',
      );
    }

    if (user.statut !== 'ACTIF') {
      throw new UnauthorizedException(
        'Votre compte est désactivé.',
      );
    }

    return user;
  }

  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  /**
   * Change le mot de passe d'un utilisateur
   * authentifié.
   *
   * Nécessite l'ancien mot de passe.
   */
  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const user =
      await this.usersService.findByIdWithPassword(
        userId,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Utilisateur introuvable.',
      );
    }

    // Vérifier l'ancien mot de passe
    const passwordValid =
      await comparePassword(
        currentPassword,
        user.password,
      );

    if (!passwordValid) {
      throw new BadRequestException(
        'L’ancien mot de passe est incorrect.',
      );
    }

    // Vérifier que le nouveau password
    // est différent
    const samePassword =
      await comparePassword(
        newPassword,
        user.password,
      );

    if (samePassword) {
      throw new BadRequestException(
        'Le nouveau mot de passe doit être différent de l’ancien.',
      );
    }

    // Hasher le nouveau password
    const hashedPassword =
      await hashPassword(
        newPassword,
      );

    // Mise à jour
    await this.usersService.updatePassword(
      userId,
      hashedPassword,
    );

    return {
      message:
        'Mot de passe modifié avec succès.',
    };
  }

  // =========================================================
  // FORGOT PASSWORD
  // =========================================================

  /**
   * Demande de réinitialisation du mot de passe.
   *
   * 1. Vérifie si l'utilisateur existe.
   * 2. Génère un OTP.
   * 3. Enregistre le hash OTP.
   * 4. Envoie l'OTP par email.
   *
   * IMPORTANT :
   * Le code OTP n'est jamais enregistré en clair.
   */
  async forgotPassword(
    email: string,
  ) {
    const normalizedEmail =
      email.trim().toLowerCase();

    const user =
      await this.usersService.findByEmail(
        normalizedEmail,
      );

    /*
     * Ne pas révéler si l'adresse existe.
     */
    if (
      !user ||
      user.statut !== 'ACTIF'
    ) {
      return {
        message:
          'Si cette adresse email existe, un code de réinitialisation sera envoyé.',
      };
    }

    // -------------------------------------------------------
    // Générer OTP
    // -------------------------------------------------------

    const otp =
      await this.otpService.createOtp(
        normalizedEmail,
        OtpType.PASSWORD_RESET,
      );

    // -------------------------------------------------------
    // Envoyer OTP par email
    // -------------------------------------------------------

    await this.mailService.sendOtpEmail(
      normalizedEmail,
      otp,
      OtpType.PASSWORD_RESET,
    );

    return {
      message:
        'Si cette adresse email existe, un code de réinitialisation sera envoyé.',
    };
  }

  // =========================================================
  // VERIFY RESET OTP
  // =========================================================

  /**
   * Vérifie le code OTP envoyé lors
   * de la récupération du mot de passe.
   *
   * Cette méthode ne change PAS encore
   * le mot de passe.
   */
  async verifyResetOtp(
    email: string,
    otp: string,
  ) {
    const normalizedEmail =
      email.trim().toLowerCase();

    const user =
      await this.usersService.findByEmail(
        normalizedEmail,
      );

    if (
      !user ||
      user.statut !== 'ACTIF'
    ) {
      throw new BadRequestException(
        'Code OTP invalide.',
      );
    }

    await this.otpService.verifyOtp(
      normalizedEmail,
      otp,
      OtpType.PASSWORD_RESET,
    );

    return {
      message:
        'Code OTP vérifié avec succès.',
    };
  }

  // =========================================================
  // RESET PASSWORD
  // =========================================================

  /**
   * Réinitialise le mot de passe après
   * vérification du code OTP.
   *
   * IMPORTANT :
   * Cette méthode doit être appelée après
   * verifyResetOtp().
   */
  async resetPassword(
    email: string,
    otp: string,
    newPassword: string,
  ) {
    const normalizedEmail =
      email.trim().toLowerCase();

    const user =
      await this.usersService.findByEmail(
        normalizedEmail,
      );

    if (
      !user ||
      user.statut !== 'ACTIF'
    ) {
      throw new BadRequestException(
        'Impossible de réinitialiser le mot de passe.',
      );
    }

    /*
     * Vérifier une nouvelle fois l'OTP.
     *
     * Cela permet de ne jamais faire confiance
     * uniquement à un appel précédent.
     */
    await this.otpService.verifyOtp(
      normalizedEmail,
      otp,
      OtpType.PASSWORD_RESET,
    );

    // -------------------------------------------------------
    // Hasher le nouveau password
    // -------------------------------------------------------

    const hashedPassword =
      await hashPassword(
        newPassword,
      );

    // -------------------------------------------------------
    // Mettre à jour le password
    // -------------------------------------------------------

    await this.usersService.updatePassword(
      user.id,
      hashedPassword,
    );

    // -------------------------------------------------------
    // Supprimer les OTP utilisés
    // -------------------------------------------------------

    await this.otpService.deleteOtps(
      normalizedEmail,
      OtpType.PASSWORD_RESET,
    );

    return {
      message:
        'Mot de passe réinitialisé avec succès.',
    };
  }

  // =========================================================
  // RESEND RESET OTP
  // =========================================================

  /**
   * Renvoie un nouveau code OTP.
   *
   * Le OtpService applique déjà une limitation
   * pour éviter les demandes répétées.
   */
  async resendResetOtp(
    email: string,
  ) {
    const normalizedEmail =
      email.trim().toLowerCase();

    const user =
      await this.usersService.findByEmail(
        normalizedEmail,
      );

    /*
     * Toujours retourner le même message
     * pour éviter de révéler l'existence
     * d'un compte.
     */
    if (
      !user ||
      user.statut !== 'ACTIF'
    ) {
      return {
        message:
          'Si cette adresse email existe, un nouveau code sera envoyé.',
      };
    }

    const otp =
      await this.otpService.createOtp(
        normalizedEmail,
        OtpType.PASSWORD_RESET,
      );

    await this.mailService.sendOtpEmail(
      normalizedEmail,
      otp,
      OtpType.PASSWORD_RESET,
    );

    return {
      message:
        'Si cette adresse email existe, un nouveau code sera envoyé.',
    };
  }

  // =========================================================
  // SANITIZE USER
  // =========================================================

  /**
   * Supprime le password avant de retourner
   * l'utilisateur.
   */
  private sanitizeUser(user: User) {
    const {
      password: _password,
      ...result
    } = user;

    return result;
  }
  // =========================================================
// VERIFY EMAIL
// =========================================================

/**
 * Vérifie l'adresse email avec un OTP.
*/
async verifyEmail(
  email: string,
  otp: string,
) {
  const normalizedEmail =
    email.trim().toLowerCase();

  // -------------------------------------------------------
  // 1. Vérifier que l'utilisateur existe
  // -------------------------------------------------------

  const user =
    await this.usersService.findByEmail(
      normalizedEmail,
    );

  if (!user) {
    throw new BadRequestException(
      'Code de vérification invalide.',
    );
  }

  // -------------------------------------------------------
  // 2. Vérifier si l'email est déjà vérifié
  // -------------------------------------------------------

  if (user.emailVerified) {
    return {
      message:
        'Cette adresse email est déjà vérifiée.',
    };
  }

  // -------------------------------------------------------
  // 3. Vérifier l'OTP
  // -------------------------------------------------------

  await this.otpService.verifyOtp(
    normalizedEmail,
    otp,
    OtpType.EMAIL_VERIFICATION,
  );

  // -------------------------------------------------------
  // 4. Marquer l'email comme vérifié
  // -------------------------------------------------------

  await this.usersService.verifyEmail(
    user.id,
  );

  // -------------------------------------------------------
  // 5. Supprimer les anciens OTP
  // -------------------------------------------------------

  await this.otpService.deleteOtps(
    normalizedEmail,
    OtpType.EMAIL_VERIFICATION,
  );

  return {
    message:
      'Adresse email vérifiée avec succès.',
  };
}


// =========================================================
// RESEND EMAIL VERIFICATION OTP
// =========================================================

/**
 * Renvoie un nouveau code OTP de vérification.
 *
 * POST /auth/resend-verification
 */
async resendVerificationOtp(
  email: string,
) {
  const normalizedEmail =
    email.trim().toLowerCase();

  const user =
    await this.usersService.findByEmail(
      normalizedEmail,
    );

  // Ne pas révéler l'existence du compte.
  if (!user || user.emailVerified) {
    return {
      message:
        'Si cette adresse nécessite une vérification, un nouveau code sera envoyé.',
    };
  }

  // Générer un nouveau OTP
  const otp =
    await this.otpService.createOtp(
      normalizedEmail,
      OtpType.EMAIL_VERIFICATION,
    );

  // Envoyer le nouveau OTP
  await this.mailService.sendOtpEmail(
    normalizedEmail,
    otp,
    OtpType.EMAIL_VERIFICATION,
  );

  return {
    message:
      'Si cette adresse nécessite une vérification, un nouveau code sera envoyé.',
  };
}

//=========================================================
// GENERATE REFRESH TOKEN
//=========================================================
private async generateRefreshToken(
  user: User,
): Promise<string> {
  const payload = {
    sub: user.id,
    type: 'refresh',
  };

  const secret =
    this.configService.getOrThrow<string>(
      'JWT_REFRESH_SECRET',
    );

  const expiresIn =
    this.configService.getOrThrow<string>(
      'JWT_REFRESH_EXPIRES_IN',
    );

  return this.jwtService.signAsync(
    payload,
    {
      secret,
      expiresIn: expiresIn as any,
    },
  );
}
// =========================================================
// REFRESH TOKEN
// =========================================================

/**
 * Génère un nouvel access token à partir
 * d'un refresh token valide.
 *
 * Rotation du refresh token :
 * - ancien refresh token utilisé
 * - nouveau access token généré
 * - nouveau refresh token généré
 */
async refresh(refreshToken: string) {
  try {
    // -------------------------------------------------------
    // 1. Vérifier le refresh token
    // -------------------------------------------------------

    const payload =
      await this.jwtService.verifyAsync<{
        sub: number;
        type: string;
      }>(refreshToken, {
        secret:
          this.configService.getOrThrow<string>(
            'JWT_REFRESH_SECRET',
          ),
      });

    // -------------------------------------------------------
    // 2. Vérifier le type du token
    // -------------------------------------------------------

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException(
        'Refresh token invalide.',
      );
    }

    // -------------------------------------------------------
    // 3. Vérifier l'utilisateur
    // -------------------------------------------------------

    const user =
      await this.usersService.findById(
        payload.sub,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Utilisateur introuvable.',
      );
    }

    // -------------------------------------------------------
    // 4. Vérifier le statut
    // -------------------------------------------------------

    if (user.statut !== 'ACTIF') {
      throw new UnauthorizedException(
        'Votre compte est désactivé.',
      );
    }

    // -------------------------------------------------------
    // 5. Vérifier l'email
    // -------------------------------------------------------

    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Votre adresse email n’est pas vérifiée.',
      );
    }

    // -------------------------------------------------------
    // 6. Générer un nouvel access token
    // -------------------------------------------------------

    const accessToken =
      await this.generateToken(
        user as User,
      );

    // -------------------------------------------------------
    // 7. Générer un nouveau refresh token
    // -------------------------------------------------------

    const newRefreshToken =
      await this.generateRefreshToken(
        user as User,
      );

    // -------------------------------------------------------
    // 8. Retourner les nouveaux tokens
    // -------------------------------------------------------

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
      user,
    };
  } catch (error) {
    // Ne pas exposer les détails du JWT
    if (
      error instanceof UnauthorizedException
    ) {
      throw error;
    }

    throw new UnauthorizedException(
      'Refresh token invalide ou expiré.',
    );
  }
}
}

