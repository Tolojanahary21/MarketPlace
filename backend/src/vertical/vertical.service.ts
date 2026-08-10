import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateVerticalDto } from './dto/create-vertical.dto';
import { UpdateVerticalDto } from './dto/update-vertical.dto';

@Injectable()
export class VerticalService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =========================================================
  // CREATE
  // POST /verticals
  // =========================================================

  async create(
    createVerticalDto: CreateVerticalDto,
  ) {
    const nom =
      createVerticalDto.nom
        .trim();

    const description =
      createVerticalDto.description
        ?.trim() || null;

    // -------------------------------------------------------
    // Vérifier le nom
    // -------------------------------------------------------

    if (!nom) {
      throw new BadRequestException(
        'Le nom du vertical est obligatoire.',
      );
    }

    // -------------------------------------------------------
    // Vérifier si le nom existe déjà
    // -------------------------------------------------------

    const existingVertical =
      await this.prisma.vertical.findFirst({
        where: {
          nom: {
            equals: nom,
            mode: 'insensitive',
          },
        },
      });

    if (existingVertical) {
      throw new BadRequestException(
        'Un vertical avec ce nom existe déjà.',
      );
    }

    // -------------------------------------------------------
    // Création
    // -------------------------------------------------------

    try {
      return await this.prisma.vertical.create({
        data: {
          nom,
          description,
        },

        include: {
          categories: true,
        },
      });
    } catch (error) {
      console.error(
        'Erreur lors de la création du vertical :',
        error,
      );

      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la création du vertical.',
      );
    }
  }

  // =========================================================
  // FIND ALL
  // GET /verticals
  // =========================================================

  async findAll() {
    return this.prisma.vertical.findMany({
      orderBy: {
        createdAt: 'desc',
      },

      include: {
        categories: true,
      },
    });
  }

  // =========================================================
  // FIND ONE
  // GET /verticals/:id
  // =========================================================

  async findById(id: number) {
    const vertical =
      await this.prisma.vertical.findUnique({
        where: {
          id,
        },

        include: {
          categories: true,
        },
      });

    if (!vertical) {
      throw new NotFoundException(
        'Vertical introuvable.',
      );
    }

    return vertical;
  }

  // =========================================================
  // UPDATE
  // PATCH /verticals/:id
  // =========================================================

  async update(
    id: number,
    updateVerticalDto: UpdateVerticalDto,
  ) {
    // Vérifier que le vertical existe
    await this.findById(id);

    const data: {
      nom?: string;
      description?: string | null;
      statut?: UpdateVerticalDto['statut'];
    } = {};

    // -------------------------------------------------------
    // Nom
    // -------------------------------------------------------

    if (
      updateVerticalDto.nom !== undefined
    ) {
      const nom =
        updateVerticalDto.nom.trim();

      if (!nom) {
        throw new BadRequestException(
          'Le nom du vertical ne peut pas être vide.',
        );
      }

      // Vérifier qu'un autre vertical
      // n'utilise pas déjà ce nom
      const existingVertical =
        await this.prisma.vertical.findFirst({
          where: {
            nom: {
              equals: nom,
              mode: 'insensitive',
            },

            NOT: {
              id,
            },
          },
        });

      if (existingVertical) {
        throw new BadRequestException(
          'Un vertical avec ce nom existe déjà.',
        );
      }

      data.nom = nom;
    }

    // -------------------------------------------------------
    // Description
    // -------------------------------------------------------

    if (
      updateVerticalDto.description !==
      undefined
    ) {
      data.description =
        updateVerticalDto.description
          ?.trim() || null;
    }

    // -------------------------------------------------------
    // Statut
    // -------------------------------------------------------

    if (
      updateVerticalDto.statut !== undefined
    ) {
      data.statut =
        updateVerticalDto.statut;
    }

    // -------------------------------------------------------
    // Mise à jour
    // -------------------------------------------------------

    return this.prisma.vertical.update({
      where: {
        id,
      },

      data,

      include: {
        categories: true,
      },
    });
  }

  // =========================================================
  // UPDATE STATUS
  // PATCH /verticals/:id/status
  // =========================================================

  async updateStatus(
    id: number,
    statut: UpdateVerticalDto['statut'],
  ) {
    await this.findById(id);

    return this.prisma.vertical.update({
      where: {
        id,
      },

      data: {
        statut,
      },

      include: {
        categories: true,
      },
    });
  }

  // =========================================================
  // DELETE
  // DELETE /verticals/:id
  // =========================================================

  async remove(id: number) {
    const vertical =
      await this.findById(id);

    // -------------------------------------------------------
    // Vérifier les catégories liées
    // -------------------------------------------------------

    if (
      vertical.categories.length > 0
    ) {
      throw new BadRequestException(
        'Impossible de supprimer ce vertical car il contient encore des catégories.',
      );
    }

    await this.prisma.vertical.delete({
      where: {
        id,
      },
    });

    return {
      message:
        'Vertical supprimé avec succès.',
    };
  }
}
