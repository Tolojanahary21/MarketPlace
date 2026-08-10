import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =========================================================
  // CREATE
  // POST /categories
  // =========================================================

  /**
   * Crée une nouvelle catégorie.
   *
   * Une catégorie doit obligatoirement
   * être associée à une Vertical existante.
   */
  async create(
    createCategoryDto: CreateCategoryDto,
  ) {
    const {
      nom,
      description,
      verticalId,
    } = createCategoryDto;

    // -------------------------------------------------------
    // 1. Vérifier que la vertical existe
    // -------------------------------------------------------

    const vertical =
      await this.prisma.vertical.findUnique({
        where: {
          id: verticalId,
        },
      });

    if (!vertical) {
      throw new BadRequestException(
        'La vertical spécifiée est introuvable.',
      );
    }

    // -------------------------------------------------------
    // 2. Vérifier le nom
    // -------------------------------------------------------

    const normalizedNom =
      nom.trim();

    if (!normalizedNom) {
      throw new BadRequestException(
        'Le nom de la catégorie est obligatoire.',
      );
    }

    // -------------------------------------------------------
    // 3. Vérifier si le nom existe déjà
    // -------------------------------------------------------

    const existingCategory =
      await this.prisma.category.findFirst({
        where: {
          nom: normalizedNom,
          verticalId,
        },
      });

    if (existingCategory) {
      throw new BadRequestException(
        'Cette catégorie existe déjà dans cette vertical.',
      );
    }

    // -------------------------------------------------------
    // 4. Création
    // -------------------------------------------------------

    try {
      return await this.prisma.category.create({
        data: {
          nom: normalizedNom,
          description:
            description?.trim() || null,
          verticalId,
        },

        include: {
          vertical: true,
        },
      });
    } catch (error) {
      console.error(
        'Erreur lors de la création de la catégorie :',
        error,
      );

      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la création de la catégorie.',
      );
    }
  }

  // =========================================================
  // FIND ALL
  // GET /categories
  // =========================================================

  /**
   * Retourne toutes les catégories.
   *
   * Pagination :
   * GET /categories?page=1&limit=20
   */
  async findAll(
    page = 1,
    limit = 20,
  ) {
    const skip =
      (page - 1) * limit;

    const [categories, total] =
      await Promise.all([
        this.prisma.category.findMany({
          skip,
          take: limit,

          orderBy: {
            createdAt: 'desc',
          },

          include: {
            vertical: true,
          },
        }),

        this.prisma.category.count(),
      ]);

    return {
      data: categories,

      meta: {
        page,
        limit,
        total,
        totalPages:
          Math.ceil(total / limit),
      },
    };
  }

  // =========================================================
  // FIND ONE
  // GET /categories/:id
  // =========================================================

  /**
   * Retourne une catégorie par son ID.
   */
  async findById(id: number) {
    const category =
      await this.prisma.category.findUnique({
        where: {
          id,
        },

        include: {
          vertical: true,
        },
      });

    if (!category) {
      throw new NotFoundException(
        'Catégorie introuvable.',
      );
    }

    return category;
  }

  // =========================================================
  // FIND BY VERTICAL
  // GET /categories/vertical/:verticalId
  // =========================================================

  /**
   * Retourne les catégories d'une vertical.
   */
  async findByVertical(
    verticalId: number,
  ) {
    // Vérifier que la vertical existe
    const vertical =
      await this.prisma.vertical.findUnique({
        where: {
          id: verticalId,
        },
      });

    if (!vertical) {
      throw new NotFoundException(
        'Vertical introuvable.',
      );
    }

    return this.prisma.category.findMany({
      where: {
        verticalId,
      },

      orderBy: {
        nom: 'asc',
      },

      include: {
        vertical: true,
      },
    });
  }

  // =========================================================
  // UPDATE
  // PATCH /categories/:id
  // =========================================================

  /**
   * Modifie une catégorie.
   *
   * Le verticalId peut également être modifié.
   */
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    // -------------------------------------------------------
    // 1. Vérifier que la catégorie existe
    // -------------------------------------------------------

    await this.findById(id);

    const {
      nom,
      description,
      verticalId,
    } = updateCategoryDto;

    // -------------------------------------------------------
    // 2. Préparer les données
    // -------------------------------------------------------

    const data: {
      nom?: string;
      description?: string | null;
      verticalId?: number;
    } = {};

    if (nom !== undefined) {
      const normalizedNom =
        nom.trim();

      if (!normalizedNom) {
        throw new BadRequestException(
          'Le nom de la catégorie ne peut pas être vide.',
        );
      }

      data.nom =
        normalizedNom;
    }

    if (description !== undefined) {
      data.description =
        description?.trim() || null;
    }

    // -------------------------------------------------------
    // 3. Changer de vertical
    // -------------------------------------------------------

    if (
      verticalId !== undefined
    ) {
      const vertical =
        await this.prisma.vertical.findUnique({
          where: {
            id: verticalId,
          },
        });

      if (!vertical) {
        throw new BadRequestException(
          'La vertical spécifiée est introuvable.',
        );
      }

      data.verticalId =
        verticalId;
    }

    // -------------------------------------------------------
    // 4. Vérifier les doublons
    // -------------------------------------------------------

    if (
      data.nom !== undefined ||
      data.verticalId !== undefined
    ) {
      const current =
        await this.prisma.category.findUnique({
          where: {
            id,
          },
        });

      const existingCategory =
        await this.prisma.category.findFirst({
          where: {
            nom:
              data.nom ??
              current!.nom,

            verticalId:
              data.verticalId ??
              current!.verticalId,

            NOT: {
              id,
            },
          },
        });

      if (existingCategory) {
        throw new BadRequestException(
          'Cette catégorie existe déjà dans cette vertical.',
        );
      }
    }

    // -------------------------------------------------------
    // 5. Mise à jour
    // -------------------------------------------------------

    return this.prisma.category.update({
      where: {
        id,
      },

      data,

      include: {
        vertical: true,
      },
    });
  }

  // =========================================================
  // UPDATE STATUS
  // PATCH /categories/:id/status
  // =========================================================

  /**
   * Active ou désactive une catégorie.
   */
  async updateStatus(
    id: number,
    statut: 'ACTIF' | 'INACTIF',
  ) {
    await this.findById(id);

    return this.prisma.category.update({
      where: {
        id,
      },

      data: {
        statut,
      },

      include: {
        vertical: true,
      },
    });
  }

  // =========================================================
  // DELETE
  // DELETE /categories/:id
  // =========================================================

  /**
   * Supprime définitivement une catégorie.
   */
  async remove(id: number) {
    await this.findById(id);

    try {
      await this.prisma.category.delete({
        where: {
          id,
        },
      });

      return {
        message:
          'Catégorie supprimée avec succès.',
      };
    } catch (error) {
      console.error(
        'Erreur lors de la suppression de la catégorie :',
        error,
      );

      throw new BadRequestException(
        'Impossible de supprimer cette catégorie. Elle peut être utilisée par des produits.',
      );
    }
  }
}