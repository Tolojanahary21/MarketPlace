import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class ImageService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =========================================================
  // CREATE
  // =========================================================

  async create(
    createImageDto: CreateImageDto,
  ) {
    const {
      productId,
      url,
      altText,
      isPrimary,
      position,
    } = createImageDto;

    // -------------------------------------------------------
    // Vérifier que le produit existe
    // -------------------------------------------------------

    const product =
      await this.prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    if (!product) {
      throw new NotFoundException(
        'Produit introuvable.',
      );
    }

    // -------------------------------------------------------
    // Si cette image devient principale,
    // retirer isPrimary des autres images
    // -------------------------------------------------------

    if (isPrimary) {
      await this.prisma.image.updateMany({
        where: {
          productId,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    // -------------------------------------------------------
    // Créer l'image
    // -------------------------------------------------------

    return this.prisma.image.create({
      data: {
        productId,
        url,
        altText,
        isPrimary:
          isPrimary ?? false,
        position:
          position ?? 0,
      },
    });
  }

  // =========================================================
  // FIND ALL
  // =========================================================

  async findAll() {
    return this.prisma.image.findMany({
      orderBy: [
        {
          productId: 'asc',
        },
        {
          position: 'asc',
        },
      ],

      include: {
        product: {
          select: {
            id: true,
            nom: true,
          },
        },
      },
    });
  }

  // =========================================================
  // FIND ALL BY PRODUCT
  // =========================================================

  async findByProduct(
    productId: number,
  ) {
    // Vérifier que le produit existe
    const product =
      await this.prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    if (!product) {
      throw new NotFoundException(
        'Produit introuvable.',
      );
    }

    return this.prisma.image.findMany({
      where: {
        productId,
      },

      orderBy: {
        position: 'asc',
      },
    });
  }

  // =========================================================
  // FIND ONE
  // =========================================================

  async findOne(id: number) {
    const image =
      await this.prisma.image.findUnique({
        where: {
          id,
        },

        include: {
          product: {
            select: {
              id: true,
              nom: true,
            },
          },
        },
      });

    if (!image) {
      throw new NotFoundException(
        'Image introuvable.',
      );
    }

    return image;
  }

  // =========================================================
  // UPDATE
  // =========================================================

  async update(
    id: number,
    updateImageDto: UpdateImageDto,
  ) {
    // Vérifier que l'image existe
    const image =
      await this.prisma.image.findUnique({
        where: {
          id,
        },
      });

    if (!image) {
      throw new NotFoundException(
        'Image introuvable.',
      );
    }

    // -------------------------------------------------------
    // Si isPrimary = true
    // retirer le statut principal des autres images
    // -------------------------------------------------------

    if (
      updateImageDto.isPrimary === true
    ) {
      await this.prisma.image.updateMany({
        where: {
          productId: image.productId,
          isPrimary: true,
          NOT: {
            id,
          },
        },
        data: {
          isPrimary: false,
        },
      });
    }

    // -------------------------------------------------------
    // Mise à jour
    // -------------------------------------------------------

    return this.prisma.image.update({
      where: {
        id,
      },

      data: {
        ...(updateImageDto.url !== undefined && {
          url: updateImageDto.url,
        }),

        ...(updateImageDto.altText !== undefined && {
          altText:
            updateImageDto.altText,
        }),

        ...(updateImageDto.isPrimary !== undefined && {
          isPrimary:
            updateImageDto.isPrimary,
        }),

        ...(updateImageDto.position !== undefined && {
          position:
            updateImageDto.position,
        }),
      },
    });
  }

  // =========================================================
  // SET PRIMARY
  // =========================================================

  async setPrimary(id: number) {
    const image =
      await this.prisma.image.findUnique({
        where: {
          id,
        },
      });

    if (!image) {
      throw new NotFoundException(
        'Image introuvable.',
      );
    }

    // Une seule image principale
    await this.prisma.image.updateMany({
      where: {
        productId: image.productId,
        isPrimary: true,
        NOT: {
          id,
        },
      },
      data: {
        isPrimary: false,
      },
    });

    return this.prisma.image.update({
      where: {
        id,
      },

      data: {
        isPrimary: true,
      },
    });
  }

  // =========================================================
  // DELETE
  // =========================================================

  async remove(id: number) {
    const image =
      await this.prisma.image.findUnique({
        where: {
          id,
        },
      });

    if (!image) {
      throw new NotFoundException(
        'Image introuvable.',
      );
    }

    await this.prisma.image.delete({
      where: {
        id,
      },
    });

    return {
      message:
        'Image supprimée avec succès.',
    };
  }
}