import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Prisma, SupplierStatut, SupplierType } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =========================================================
  // CREATE
  // POST /suppliers
  // =========================================================

  /**
   * Crée un nouveau fournisseur.
   *
   * userId est optionnel.
   *
   * Si userId est fourni, il doit correspondre
   * à un utilisateur existant et ne doit pas déjà
   * être lié à un autre fournisseur.
   */
  async create(
    createSupplierDto: CreateSupplierDto,
  ) {
    const displayName =
      createSupplierDto.displayName
        .trim();

    const entreprise =
      createSupplierDto.entreprise
        ?.trim() || null;

    const telephone2 =
      createSupplierDto.telephone2
        ?.trim() || null;

    const website =
      createSupplierDto.website
        ?.trim() || null;

    if (!displayName) {
      throw new BadRequestException(
        'Le nom du fournisseur est obligatoire.',
      );
    }

    // -------------------------------------------------------
    // Vérifier le userId
    // -------------------------------------------------------

    if (
      createSupplierDto.userId !== undefined &&
      createSupplierDto.userId !== null
    ) {
      const user =
        await this.prisma.user.findUnique({
          where: {
            id: createSupplierDto.userId,
          },
        });

      if (!user) {
        throw new NotFoundException(
          'Utilisateur introuvable.',
        );
      }

      const existingSupplier =
        await this.prisma.supplier.findUnique({
          where: {
            userId:
              createSupplierDto.userId,
          },
        });

      if (existingSupplier) {
        throw new BadRequestException(
          'Cet utilisateur est déjà lié à un fournisseur.',
        );
      }
    }

    // -------------------------------------------------------
    // Création
    // -------------------------------------------------------

    try {
      return await this.prisma.supplier.create({
        data: {
          displayName,
          entreprise,
          telephone2,
          website,

          dateCreation:
            createSupplierDto.dateCreation
              ? new Date(
                  createSupplierDto.dateCreation,
                )
              : null,

          paymentTerms:
            createSupplierDto.paymentTerms
              ? (createSupplierDto.paymentTerms as Prisma.InputJsonValue)
              : undefined,

          bankInfo:
            createSupplierDto.bankInfo
              ? (createSupplierDto.bankInfo as Prisma.InputJsonValue)
              : undefined,

          statut:
            createSupplierDto.statut ??
            SupplierStatut.ACTIF,

          type:
            createSupplierDto.type,

          userId:
            createSupplierDto.userId ?? null,
        },

        select:
          this.publicSupplierSelect(),
      });
    } catch (error) {
      console.error(
        'Erreur création fournisseur :',
        error,
      );

      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la création du fournisseur.',
      );
    }
  }

  // =========================================================
  // FIND ALL
  // GET /suppliers
  // =========================================================

  /**
   * Retourne tous les fournisseurs.
   */
  async findAll() {
    return this.prisma.supplier.findMany({
      orderBy: {
        createdAt: 'desc',
      },

      select:
        this.publicSupplierSelect(),
    });
  }

  // =========================================================
  // FIND ONE
  // GET /suppliers/:id
  // =========================================================

  /**
   * Retourne un fournisseur par son ID.
   */
  async findOne(id: number) {
    const supplier =
      await this.prisma.supplier.findUnique({
        where: {
          id,
        },

        select:
          this.publicSupplierSelect(),
      });

    if (!supplier) {
      throw new NotFoundException(
        'Fournisseur introuvable.',
      );
    }

    return supplier;
  }

  // =========================================================
  // FIND BY USER ID
  // =========================================================

  /**
   * Recherche le fournisseur associé
   * à un utilisateur.
   */
  async findByUserId(userId: number) {
    return this.prisma.supplier.findUnique({
      where: {
        userId,
      },

      select:
        this.publicSupplierSelect(),
    });
  }

  // =========================================================
  // UPDATE
  // PATCH /suppliers/:id
  // =========================================================

  /**
   * Modifie les informations d'un fournisseur.
   */
  async update(
    id: number,
    updateSupplierDto: UpdateSupplierDto,
  ) {
    // Vérifier que le fournisseur existe
    await this.findOne(id);

    // -------------------------------------------------------
    // Préparer les données
    // -------------------------------------------------------

    const data: Prisma.SupplierUpdateInput = {};

    if (
      updateSupplierDto.displayName !==
      undefined
    ) {
      const displayName =
        updateSupplierDto.displayName.trim();

      if (!displayName) {
        throw new BadRequestException(
          'Le nom du fournisseur ne peut pas être vide.',
        );
      }

      data.displayName = displayName;
    }

    if (
      updateSupplierDto.entreprise !==
      undefined
    ) {
      data.entreprise =
        updateSupplierDto.entreprise
          ?.trim() || null;
    }

    if (
      updateSupplierDto.telephone2 !==
      undefined
    ) {
      data.telephone2 =
        updateSupplierDto.telephone2
          ?.trim() || null;
    }

    if (
      updateSupplierDto.website !==
      undefined
    ) {
      data.website =
        updateSupplierDto.website
          ?.trim() || null;
    }

    if (
      updateSupplierDto.dateCreation !==
      undefined
    ) {
      data.dateCreation =
        updateSupplierDto.dateCreation
          ? new Date(
              updateSupplierDto.dateCreation,
            )
          : null;
    }

    if (
      updateSupplierDto.paymentTerms !==
      undefined
    ) {
      data.paymentTerms =
        updateSupplierDto.paymentTerms === null
          ? Prisma.JsonNull
          : (updateSupplierDto.paymentTerms as Prisma.InputJsonValue);
    }

    if (
      updateSupplierDto.bankInfo !==
      undefined
    ) {
      data.bankInfo =
        updateSupplierDto.bankInfo === null
          ? Prisma.JsonNull
          : (updateSupplierDto.bankInfo as Prisma.InputJsonValue);
    }

    if (
      updateSupplierDto.statut !==
      undefined
    ) {
      data.statut =
        updateSupplierDto.statut;
    }

    if (
      updateSupplierDto.type !==
      undefined
    ) {
      data.type =
        updateSupplierDto.type;
    }

    // -------------------------------------------------------
    // Modifier le userId
    // -------------------------------------------------------

    if (
      updateSupplierDto.userId !==
      undefined
    ) {
      if (
        updateSupplierDto.userId === null
      ) {
        data.user = {
          disconnect: true,
        };
      } else {
        // Vérifier que l'utilisateur existe
        const user =
          await this.prisma.user.findUnique({
            where: {
              id:
                updateSupplierDto.userId,
            },
          });

        if (!user) {
          throw new NotFoundException(
            'Utilisateur introuvable.',
          );
        }

        // Vérifier qu'il n'est pas déjà
        // lié à un autre fournisseur
        const existingSupplier =
          await this.prisma.supplier.findUnique({
            where: {
              userId:
                updateSupplierDto.userId,
            },
          });

        if (
          existingSupplier &&
          existingSupplier.id !== id
        ) {
          throw new BadRequestException(
            'Cet utilisateur est déjà lié à un autre fournisseur.',
          );
        }

        data.user = {
          connect: {
            id:
              updateSupplierDto.userId,
          },
        };
      }
    }

    // -------------------------------------------------------
    // Mise à jour
    // -------------------------------------------------------

    try {
      return await this.prisma.supplier.update({
        where: {
          id,
        },

        data,

        select:
          this.publicSupplierSelect(),
      });
    } catch (error) {
      console.error(
        'Erreur modification fournisseur :',
        error,
      );

      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la modification du fournisseur.',
      );
    }
  }

  // =========================================================
  // DELETE
  // DELETE /suppliers/:id
  // =========================================================

  /**
   * Supprime définitivement un fournisseur.
   */
  async remove(id: number) {
    await this.findOne(id);

    try {
      await this.prisma.supplier.delete({
        where: {
          id,
        },
      });

      return {
        message:
          'Fournisseur supprimé avec succès.',
      };
    } catch (error) {
      console.error(
        'Erreur suppression fournisseur :',
        error,
      );

      throw new InternalServerErrorException(
        'Impossible de supprimer le fournisseur.',
      );
    }
  }

  // =========================================================
  // PUBLIC SUPPLIER SELECT
  // =========================================================

  /**
   * Champs retournés au frontend.
   */
  private publicSupplierSelect() {
    return {
      id: true,
      displayName: true,
      entreprise: true,
      telephone2: true,
      website: true,
      dateCreation: true,
      paymentTerms: true,
      bankInfo: true,
      statut: true,
      type: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    } as const;
  }
}