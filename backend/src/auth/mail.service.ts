import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

import { OtpType } from '@prisma/client';

@Injectable()
export class MailService {
  private readonly resend: Resend;
  private readonly logger = new Logger(
    MailService.name,
  );

  private readonly from: string;

  constructor(
    private readonly configService: ConfigService,
  ) {
    const apiKey =
      this.configService.get<string>(
        'RESEND_API_KEY',
      );

    const from =
      this.configService.get<string>(
        'MAIL_FROM',
      );

    if (!apiKey) {
      throw new Error(
        'RESEND_API_KEY n\'est pas configurée.',
      );
    }

    if (!from) {
      throw new Error(
        'MAIL_FROM n\'est pas configurée.',
      );
    }

    this.resend = new Resend(apiKey);
    this.from = from;
  }

  // =========================================================
  // ENVOYER UN OTP
  // =========================================================

  /**
   * Envoie un code OTP par email.
   *
   * Utilisé pour :
   *
   * - vérification du compte
   * - réinitialisation du mot de passe
   */
  async sendOtpEmail(
    email: string,
    otp: string,
    type: OtpType,
  ): Promise<void> {
    const normalizedEmail =
      email.trim().toLowerCase();

    const isEmailVerification =
      type === OtpType.EMAIL_VERIFICATION;

    const subject =
      isEmailVerification
        ? 'Vérification de votre compte'
        : 'Réinitialisation de votre mot de passe';

    const title =
      isEmailVerification
        ? 'Vérifiez votre adresse email'
        : 'Réinitialisez votre mot de passe';

    const description =
      isEmailVerification
        ? 'Utilisez le code ci-dessous pour vérifier votre adresse email.'
        : 'Utilisez le code ci-dessous pour réinitialiser votre mot de passe.';

    try {
      const { data, error } =
        await this.resend.emails.send({
          from: this.from,
          to: normalizedEmail,
          subject,

          html: this.buildOtpTemplate(
            title,
            description,
            otp,
            isEmailVerification,
          ),
        });

      if (error) {
        this.logger.error(
          'Erreur Resend',
          error,
        );

        throw new InternalServerErrorException(
          'Impossible d’envoyer l’email.',
        );
      }

      this.logger.log(
        `Email OTP envoyé à ${normalizedEmail}. ID: ${data?.id}`,
      );
    } catch (error) {
      this.logger.error(
        'Erreur lors de l’envoi de l’email.',
        error,
      );

      if (
        error instanceof
        InternalServerErrorException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Impossible d’envoyer l’email.',
      );
    }
  }

  // =========================================================
  // TEMPLATE OTP
  // =========================================================

  /**
   * Génère le HTML de l'email OTP.
   */
  private buildOtpTemplate(
    title: string,
    description: string,
    otp: string,
    isEmailVerification: boolean,
  ): string {
    const actionText =
      isEmailVerification
        ? 'Vérification du compte'
        : 'Réinitialisation du mot de passe';

    return `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8" />

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />

          <title>${title}</title>
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            font-family: Arial, Helvetica, sans-serif;
          "
        >
          <div
            style="
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 12px;
              padding: 40px;
              box-sizing: border-box;
            "
          >

            <h1
              style="
                margin: 0 0 20px;
                font-size: 24px;
                color: #222222;
              "
            >
              ${title}
            </h1>

            <p
              style="
                color: #555555;
                font-size: 16px;
                line-height: 1.6;
              "
            >
              ${description}
            </p>

            <p
              style="
                color: #555555;
                font-size: 14px;
              "
            >
              ${actionText}
            </p>

            <div
              style="
                margin: 30px 0;
                padding: 20px;
                background-color: #f1f1f1;
                border-radius: 10px;
                text-align: center;
              "
            >
              <span
                style="
                  font-size: 36px;
                  font-weight: bold;
                  letter-spacing: 8px;
                  color: #111111;
                "
              >
                ${otp}
              </span>
            </div>

            <p
              style="
                color: #666666;
                font-size: 14px;
                line-height: 1.5;
              "
            >
              Ce code est valable pendant
              <strong>10 minutes</strong>.
            </p>

            <p
              style="
                color: #666666;
                font-size: 14px;
                line-height: 1.5;
              "
            >
              Si vous n'êtes pas à l'origine de cette
              demande, vous pouvez simplement ignorer
              cet email.
            </p>

            <hr
              style="
                margin: 30px 0;
                border: none;
                border-top: 1px solid #eeeeee;
              "
            />

            <p
              style="
                margin: 0;
                color: #999999;
                font-size: 12px;
                text-align: center;
              "
            >
              Cet email a été envoyé automatiquement.
              Merci de ne pas y répondre.
            </p>

          </div>
        </body>
      </html>
    `;
  }
}

