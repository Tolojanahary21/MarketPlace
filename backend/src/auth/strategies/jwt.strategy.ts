import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import { UsersService } from 'src/users/dto/users.service';


// =========================================================
// Type du payload JWT
// =========================================================

export interface JwtPayload {
  sub: number;
  email: string;
  role: 'ADMIN' | 'VENDEUR' | 'ACHETEUR';
}


// =========================================================
// Type de l'utilisateur disponible dans req.user
// =========================================================

export interface JwtUser {
  id: number;
  email: string;
  role: 'ADMIN' | 'VENDEUR' | 'ACHETEUR';
}


// =========================================================
// JWT STRATEGY
// =========================================================

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Le token doit obligatoirement être valide
      ignoreExpiration: false,

      // Secret utilisé pour vérifier le JWT
      secretOrKey:
        configService.getOrThrow<string>(
          'JWT_SECRET',
        ),
    });
  }

  // =======================================================
  // VALIDATE
  // =======================================================

  /**
   * Cette méthode est appelée automatiquement par Passport
   * lorsque le JWT est valide.
   *
   * Le résultat est placé dans req.user.
   */
  async validate(
    payload: JwtPayload,
  ): Promise<JwtUser> {
    // Vérification du payload
    if (
      !payload.sub ||
      !payload.email ||
      !payload.role
    ) {
      throw new UnauthorizedException(
        'Token JWT invalide.',
      );
    }

    // Vérifier que l'utilisateur existe toujours
    const user =
      await this.usersService.findById(
        payload.sub,
      );
    if (!user) {
      throw new UnauthorizedException(
        'Utilisateur introuvable.',
      );
    }

    // Vérifier que le compte est toujours actif
    if (user.statut !== 'ACTIF') {
      throw new UnauthorizedException(
        'Votre compte est désactivé.',
      );
    }

    // Ce retour devient req.user
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}

