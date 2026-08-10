import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdateUserRoleDto } from '../dto/update-user-role.dto';
import { UpdateUserStatusDto } from '../dto/update-user-status.dto';

import { hashPassword } from '../../../utils/hash.util';
import { OtpService } from 'src/auth/otp.service';
import { MailService } from 'src/auth/mail.service';
import { OtpType } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
  ) {}

  // =========================================================
  // REGISTER
  // POST /users/register
  // =========================================================

  /**
   * Inscription publique.
   *
   * L'utilisateur est créé avec :
   *
   * role          = ACHETEUR
   * statut        = ACTIF
   * emailVerified = false
   *
   * Après création, AuthService pourra générer
   * un OTP et l'envoyer par email.
   */
  async register(
    createUserDto: CreateUserDto,
  ) {
    // -------------------------------------------------------
    // 1. Normalisation
    // -------------------------------------------------------

    const nom =
      createUserDto.nom.trim();

    const prenom =
      createUserDto.prenom.trim();

    const email =
      createUserDto.email
        .trim()
        .toLowerCase();

    const telephone =
      createUserDto.telephone?.trim() ||
      null;

    // -------------------------------------------------------
    // 2. Validation
    // -------------------------------------------------------

    if (!nom || !prenom || !email) {
      throw new BadRequestException(
        'Le nom, le prénom et l’email sont obligatoires.',
      );
    }

    // -------------------------------------------------------
    // 3. Vérifier email
    // -------------------------------------------------------

    const existingUser =
      await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      throw new BadRequestException(
        'Cette adresse email est déjà utilisée.',
      );
    }

    // -------------------------------------------------------
    // 4. Hash password
    // -------------------------------------------------------

    const hashedPassword =
      await hashPassword(
        createUserDto.password,
      );

    // -------------------------------------------------------
    // 5. Création
    // -------------------------------------------------------

    try {
      const user =
        await this.prisma.user.create({
          data: {
            nom,
            prenom,
            email,
            password: hashedPassword,
            telephone,

            // Valeurs par défaut
            // role = ACHETEUR
            // statut = ACTIF

            emailVerified: false,
          },

          select:
            this.publicUserSelect(),
        });
      // ------------------------------------------------------- 
      // 2. Générer l'OTP de vérification 
      // ------------------------------------------------------- 
      const otp = await this.otpService.createOtp( user.email, OtpType.EMAIL_VERIFICATION, ); 
      // ------------------------------------------------------- 
      // 3. Envoyer l'OTP par email 
      // ------------------------------------------------------- 
      await this.mailService.sendOtpEmail( user.email, otp, OtpType.EMAIL_VERIFICATION, );

      return { message: 'Utilisateur créé. Un code de vérification a été envoyé à votre adresse email.', user, };
    } catch (error) {
      console.error(
        'Erreur création utilisateur:',
        error,
      );

      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la création de l’utilisateur.',
      );
    }
  }

  // =========================================================
  // LIST
  // GET /users
  // =========================================================

  async findAll(
    page = 1,
    limit = 20,
  ) {
    // Protection contre les valeurs invalides
    page = Math.max(1, page);
    limit = Math.min(
      Math.max(1, limit),
      100,
    );

    const skip =
      (page - 1) * limit;

    const [users, total] =
      await Promise.all([
        this.prisma.user.findMany({
          skip,
          take: limit,

          orderBy: {
            createdAt: 'desc',
          },

          select:
            this.publicUserSelect(),
        }),

        this.prisma.user.count(),
      ]);

    return {
      data: users,

      meta: {
        page,
        limit,
        total,
        totalPages:
          Math.ceil(
            total / limit,
          ),
      },
    };
  }

  // =========================================================
  // DETAIL
  // GET /users/:id
  // =========================================================

  async findById(id: number) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id,
        },

        select:
          this.publicUserSelect(),
      });

    if (!user) {
      throw new NotFoundException(
        'Utilisateur introuvable.',
      );
    }

    return user;
  }

  // =========================================================
  // FIND BY EMAIL
  // =========================================================

  /**
   * Recherche interne par email.
   *
   * Le password est volontairement retourné.
   *
   * Utilisé par AuthService pour :
   * - login
   * - forgot password
   * - vérification du compte
   */
  async findByEmail(
    email: string,
  ) {
    return this.prisma.user.findUnique({
      where: {
        email: email
          .trim()
          .toLowerCase(),
      },
    });
  }

  // =========================================================
  // FIND BY ID + PASSWORD
  // =========================================================

  /**
   * Recherche interne avec password.
   *
   * NE PAS exposer directement dans un controller.
   */
  async findByIdWithPassword(
    id: number,
  ) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  // =========================================================
  // UPDATE PROFILE
  // PATCH /users/:id
  // =========================================================

  /**
   * Modification des informations générales.
   *
   * Le password, role et statut ne sont pas
   * modifiés ici.
   *
   * Si l'email change :
   *
   * emailVerified = false
   *
   * L'utilisateur devra alors vérifier
   * sa nouvelle adresse email.
   */
  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ) {
    // Vérifier existence
    const currentUser =
      await this.findById(id);

    const data: {
      nom?: string;
      prenom?: string;
      email?: string;
      telephone?: string | null;
      emailVerified?: boolean;
    } = {};

    // -------------------------------------------------------
    // Nom
    // -------------------------------------------------------

    if (
      updateUserDto.nom !== undefined
    ) {
      const nom =
        updateUserDto.nom.trim();

      if (!nom) {
        throw new BadRequestException(
          'Le nom ne peut pas être vide.',
        );
      }

      data.nom = nom;
    }

    // -------------------------------------------------------
    // Prénom
    // -------------------------------------------------------

    if (
      updateUserDto.prenom !== undefined
    ) {
      const prenom =
        updateUserDto.prenom.trim();

      if (!prenom) {
        throw new BadRequestException(
          'Le prénom ne peut pas être vide.',
        );
      }

      data.prenom = prenom;
    }

    // -------------------------------------------------------
    // Téléphone
    // -------------------------------------------------------

    if (
      updateUserDto.telephone !== undefined
    ) {
      data.telephone =
        updateUserDto.telephone
          ?.trim() || null;
    }

    // -------------------------------------------------------
    // Email
    // -------------------------------------------------------

    if (
      updateUserDto.email !== undefined
    ) {
      const email =
        updateUserDto.email
          .trim()
          .toLowerCase();

      // Si email identique
      if (email === currentUser.email) {
        data.email = email;
      } else {
        const existingUser =
          await this.prisma.user.findFirst({
            where: {
              email,

              NOT: {
                id,
              },
            },
          });

        if (existingUser) {
          throw new BadRequestException(
            'Cette adresse email est déjà utilisée.',
          );
        }

        data.email = email;

        /*
         * Nouvelle adresse email =
         * nouvelle vérification obligatoire.
         */
        data.emailVerified = false;
      }
    }

    // -------------------------------------------------------
    // Update
    // -------------------------------------------------------

    return this.prisma.user.update({
      where: {
        id,
      },

      data,

      select:
        this.publicUserSelect(),
    });
  }

  // =========================================================
  // UPDATE STATUS
  // PATCH /users/:id/status
  // =========================================================

  async updateStatus(
    id: number,
    dto: UpdateUserStatusDto,
  ) {
    await this.findById(id);

    return this.prisma.user.update({
      where: {
        id,
      },

      data: {
        statut: dto.statut,
      },

      select:
        this.publicUserSelect(),
    });
  }

  // =========================================================
  // UPDATE ROLE
  // PATCH /users/:id/role
  // =========================================================

  async updateRole(
    id: number,
    dto: UpdateUserRoleDto,
  ) {
    await this.findById(id);

    return this.prisma.user.update({
      where: {
        id,
      },

      data: {
        role: dto.role,
      },

      select:
        this.publicUserSelect(),
    });
  }

  // =========================================================
  // VERIFY EMAIL
  // =========================================================

  /**
   * Marque l'adresse email comme vérifiée.
   *
   * La vérification de l'OTP est effectuée
   * par OtpService.
   *
   * Cette méthode ne vérifie PAS directement
   * le code OTP.
   */
  async verifyEmail(
    userId: number,
  ) {
    const user =
      await this.findById(userId);

    if (user.emailVerified) {
      throw new BadRequestException(
        'Cette adresse email est déjà vérifiée.',
      );
    }

    return this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        emailVerified: true,
      },

      select:
        this.publicUserSelect(),
    });
  }

  // =========================================================
  // UPDATE PASSWORD
  // =========================================================

  /**
   * Met à jour le password.
   *
   * Le password reçu doit déjà être hashé.
   */
  async updatePassword(
    id: number,
    hashedPassword: string,
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

    if (!user) {
      throw new NotFoundException(
        'Utilisateur introuvable.',
      );
    }

    return this.prisma.user.update({
      where: {
        id,
      },

      data: {
        password: hashedPassword,
      },

      select: {
        id: true,
        email: true,
        updatedAt: true,
      },
    });
  }

  // =========================================================
  // DELETE
  // DELETE /users/:id
  // =========================================================

  async remove(id: number) {
    await this.findById(id);

    await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return {
      message:
        'Utilisateur supprimé avec succès.',
    };
  }

  // =========================================================
  // PUBLIC USER SELECT
  // =========================================================

  /**
   * Champs pouvant être retournés au frontend.
   *
   * Le password n'est JAMAIS retourné.
   */
  private publicUserSelect() {
    return {
      id: true,
      nom: true,
      prenom: true,
      email: true,
      role: true,
      statut: true,
      telephone: true,

      // État de vérification email
      emailVerified: true,

      createdAt: true,
      updatedAt: true,
    } as const;
  }
  
}


