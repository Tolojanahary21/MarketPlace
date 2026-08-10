import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,

} from '@nestjs/common';

import { OtpType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import {
  comparePassword,
  hashPassword,
} from '../../utils/hash.util';

@Injectable()
export class OtpService {
  /**
   * Durée de validité d'un OTP :
   * 10 minutes
   */
  private readonly OTP_EXPIRATION_MINUTES = 10;

  /**
   * Nombre maximum de tentatives
   */
  private readonly MAX_ATTEMPTS = 5;

  /**
   * Temps minimum avant de pouvoir
   * demander un nouveau code :
   * 60 secondes
   */
  private readonly RESEND_DELAY_SECONDS = 60;

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =========================================================
  // GÉNÉRER UN OTP
  // =========================================================

  /**
   * Génère un code OTP à 6 chiffres.
   *
   * Exemple :
   * 483921
   */
  private generateOtp(): string {
    return Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
  }

  // =========================================================
  // CRÉER UN OTP
  // =========================================================

  /**
   * Crée un nouveau OTP.
   *
   * Le code n'est jamais enregistré en clair
   * dans la base de données.
   */
  async createOtp(
    email: string,
    type: OtpType,
  ): Promise<string> {
    const normalizedEmail =
      email.trim().toLowerCase();

    // -------------------------------------------------------
    // Vérifier si un OTP récent existe
    // -------------------------------------------------------

    const recentOtp =
      await this.prisma.otpCode.findFirst({
        where: {
          email: normalizedEmail,
          type,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    if (recentOtp) {
      const secondsSinceCreation =
        (Date.now() -
          recentOtp.createdAt.getTime()) /
        1000;

      if (
        secondsSinceCreation <
        this.RESEND_DELAY_SECONDS
      ) {
        throw new HttpException(
          `Veuillez attendre ${Math.ceil(
            this.RESEND_DELAY_SECONDS -
              secondsSinceCreation,
          )} secondes avant de demander un nouveau code.`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }

    // -------------------------------------------------------
    // Générer le code
    // -------------------------------------------------------

    const otp = this.generateOtp();

    // -------------------------------------------------------
    // Hasher le code
    // -------------------------------------------------------

    const codeHash =
      await hashPassword(otp);

    // -------------------------------------------------------
    // Date d'expiration
    // -------------------------------------------------------

    const expiresAt = new Date(
      Date.now() +
        this.OTP_EXPIRATION_MINUTES *
          60 *
          1000,
    );

    // -------------------------------------------------------
    // Supprimer les anciens OTP
    // -------------------------------------------------------

    await this.prisma.otpCode.deleteMany({
      where: {
        email: normalizedEmail,
        type,
      },
    });

    // -------------------------------------------------------
    // Enregistrer le nouvel OTP
    // -------------------------------------------------------

    await this.prisma.otpCode.create({
      data: {
        email: normalizedEmail,
        codeHash,
        type,
        expiresAt,
        attempts: 0,
        verified: false,
      },
    });

    // -------------------------------------------------------
    // IMPORTANT
    // -------------------------------------------------------
    // On retourne le code uniquement pour que MailService
    // puisse l'envoyer par email.
    //
    // Le code en clair n'est PAS enregistré en DB.
    // -------------------------------------------------------

    return otp;
  }

  // =========================================================
  // VÉRIFIER UN OTP
  // =========================================================

  /**
   * Vérifie un OTP.
   *
   * Retourne true si le code est valide.
   */
  async verifyOtp(
    email: string,
    code: string,
    type: OtpType,
  ): Promise<boolean> {
    const normalizedEmail =
      email.trim().toLowerCase();

    // -------------------------------------------------------
    // Chercher le dernier OTP
    // -------------------------------------------------------

    const otp =
      await this.prisma.otpCode.findFirst({
        where: {
          email: normalizedEmail,
          type,
          verified: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    if (!otp) {
      throw new BadRequestException(
        'Code OTP invalide ou inexistant.',
      );
    }

    // -------------------------------------------------------
    // Vérifier l'expiration
    // -------------------------------------------------------

    if (
      otp.expiresAt.getTime() <
      Date.now()
    ) {
      await this.prisma.otpCode.delete({
        where: {
          id: otp.id,
        },
      });

      throw new BadRequestException(
        'Le code OTP a expiré.',
      );
    }

    // -------------------------------------------------------
    // Vérifier le nombre de tentatives
    // -------------------------------------------------------

    if (
      otp.attempts >=
      this.MAX_ATTEMPTS
    ) {
      throw new HttpException(
        'Nombre maximum de tentatives atteint. Veuillez demander un nouveau code.',
        HttpStatus.TOO_MANY_REQUESTS,   
      );
    }

    // -------------------------------------------------------
    // Vérifier que le code contient 6 chiffres
    // -------------------------------------------------------

    if (!/^\d{6}$/.test(code)) {
      throw new BadRequestException(
        'Le code OTP doit contenir exactement 6 chiffres.',
      );
    }

    // -------------------------------------------------------
    // Comparer le code avec le hash
    // -------------------------------------------------------

    const isValid =
      await comparePassword(
        code,
        otp.codeHash,
      );

    // -------------------------------------------------------
    // Code incorrect
    // -------------------------------------------------------

    if (!isValid) {
      await this.prisma.otpCode.update({
        where: {
          id: otp.id,
        },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });

      const remainingAttempts =
        this.MAX_ATTEMPTS -
        (otp.attempts + 1);

      if (remainingAttempts <= 0) {
        throw new  HttpException(
          'Nombre maximum de tentatives atteint. Veuillez demander un nouveau code.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      throw new BadRequestException(
        `Code OTP incorrect. Il vous reste ${remainingAttempts} tentative(s).`,
      );
    }

    // -------------------------------------------------------
    // Code correct
    // -------------------------------------------------------

    await this.prisma.otpCode.update({
      where: {
        id: otp.id,
      },
      data: {
        verified: true,
      },
    });

    return true;
  }

  // =========================================================
  // SUPPRIMER UN OTP
  // =========================================================

  /**
   * Supprime tous les OTP d'un email pour un type donné.
   */
  async deleteOtps(
    email: string,
    type: OtpType,
  ): Promise<void> {
    const normalizedEmail =
      email.trim().toLowerCase();

    await this.prisma.otpCode.deleteMany({
      where: {
        email: normalizedEmail,
        type,
      },
    });
  }

  // =========================================================
  // NETTOYAGE DES OTP EXPIRÉS
  // =========================================================

  /**
   * Supprime les OTP expirés.
   *
   * Cette méthode pourra être appelée par un Cron.
   */
  async deleteExpiredOtps(): Promise<void> {
    await this.prisma.otpCode.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}