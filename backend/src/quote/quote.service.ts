import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';

@Injectable()
export class QuoteService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =========================================================
  // CREATE
  // =========================================================

  async create(
    createQuoteDto: CreateQuoteDto,
  ) {
    const {
      nom,
      statut,
      clientId,
      supplierId,
      items,
      notes,
      total,
      leadTime,
    } = createQuoteDto;

    // -------------------------------------------------------
    // Vérifier le client
    // -------------------------------------------------------

    const client =
      await this.prisma.client.findUnique({
        where: {
          id: clientId,
        },
      });

    if (!client) {
      throw new NotFoundException(
        'Client introuvable.',
      );
    }

    // -------------------------------------------------------
    // Vérifier le fournisseur
    // -------------------------------------------------------

    const supplier =
      await this.prisma.supplier.findUnique({
        where: {
          id: supplierId,
        },
      });

    if (!supplier) {
      throw new NotFoundException(
        'Fournisseur introuvable.',
      );
    }

    // -------------------------------------------------------
    // Création du devis
    // -------------------------------------------------------

    return this.prisma.quote.create({
      data: {
        nom,

        statut:
          statut ?? 'BROUILLON',

        clientId,
        supplierId,

        items: items ?? undefined,

        notes:
          notes ?? undefined,

        total:
          total !== undefined
            ? total
            : undefined,

        leadTime:
          leadTime ?? undefined,
      },

      include: {
        client: true,
        supplier: true,
      },
    });
  }

  // =========================================================
  // FIND ALL
  // =========================================================

  async findAll() {
    return this.prisma.quote.findMany({
      orderBy: {
        createdAt: 'desc',
      },

      include: {
        client: true,

        supplier: true,
      },
    });
  }

  // =========================================================
  // FIND ONE
  // =========================================================

  async findOne(id: number) {
    const quote =
      await this.prisma.quote.findUnique({
        where: {
          id,
        },

        include: {
          client: true,

          supplier: true,

          purchaseOrder: true,
        },
      });

    if (!quote) {
      throw new NotFoundException(
        'Devis introuvable.',
      );
    }

    return quote;
  }

  // =========================================================
  // FIND BY CLIENT
  // =========================================================

  async findByClient(
    clientId: number,
  ) {
    const client =
      await this.prisma.client.findUnique({
        where: {
          id: clientId,
        },
      });

    if (!client) {
      throw new NotFoundException(
        'Client introuvable.',
      );
    }

    return this.prisma.quote.findMany({
      where: {
        clientId,
      },

      orderBy: {
        createdAt: 'desc',
      },

      include: {
        supplier: true,
      },
    });
  }

  // =========================================================
  // FIND BY SUPPLIER
  // =========================================================

  async findBySupplier(
    supplierId: number,
  ) {
    const supplier =
      await this.prisma.supplier.findUnique({
        where: {
          id: supplierId,
        },
      });

    if (!supplier) {
      throw new NotFoundException(
        'Fournisseur introuvable.',
      );
    }

    return this.prisma.quote.findMany({
      where: {
        supplierId,
      },

      orderBy: {
        createdAt: 'desc',
      },

      include: {
        client: true,
      },
    });
  }

  // =========================================================
  // UPDATE
  // =========================================================

  async update(
    id: number,
    updateQuoteDto: UpdateQuoteDto,
  ) {
    // -------------------------------------------------------
    // Vérifier le devis
    // -------------------------------------------------------

    const quote =
      await this.prisma.quote.findUnique({
        where: {
          id,
        },
      });

    if (!quote) {
      throw new NotFoundException(
        'Devis introuvable.',
      );
    }

    const {
      nom,
      statut,
      clientId,
      supplierId,
      items,
      notes,
      total,
      leadTime,
    } = updateQuoteDto;

    // -------------------------------------------------------
    // Vérifier le nouveau client
    // -------------------------------------------------------

    if (
      clientId !== undefined &&
      clientId !== quote.clientId
    ) {
      const client =
        await this.prisma.client.findUnique({
          where: {
            id: clientId,
          },
        });

      if (!client) {
        throw new NotFoundException(
          'Client introuvable.',
        );
      }
    }

    // -------------------------------------------------------
    // Vérifier le nouveau fournisseur
    // -------------------------------------------------------

    if (
      supplierId !== undefined &&
      supplierId !== quote.supplierId
    ) {
      const supplier =
        await this.prisma.supplier.findUnique({
          where: {
            id: supplierId,
          },
        });

      if (!supplier) {
        throw new NotFoundException(
          'Fournisseur introuvable.',
        );
      }
    }

    // -------------------------------------------------------
    // Mise à jour
    // -------------------------------------------------------

    return this.prisma.quote.update({
      where: {
        id,
      },

      data: {
        ...(nom !== undefined && {
          nom,
        }),

        ...(statut !== undefined && {
          statut,
        }),

        ...(clientId !== undefined && {
          clientId,
        }),

        ...(supplierId !== undefined && {
          supplierId,
        }),

        ...(items !== undefined && {
          items,
        }),

        ...(notes !== undefined && {
          notes,
        }),

        ...(total !== undefined && {
          total,
        }),

        ...(leadTime !== undefined && {
          leadTime,
        }),
      },

      include: {
        client: true,
        supplier: true,
      },
    });
  }

  // =========================================================
  // UPDATE STATUS
  // =========================================================

  async updateStatus(
    id: number,
    statut: CreateQuoteDto['statut'],
  ) {
    const quote =
      await this.prisma.quote.findUnique({
        where: {
          id,
        },
      });

    if (!quote) {
      throw new NotFoundException(
        'Devis introuvable.',
      );
    }

    return this.prisma.quote.update({
      where: {
        id,
      },

      data: {
        statut,
      },
    });
  }

  // =========================================================
  // DELETE
  // =========================================================

  async remove(id: number) {
    const quote =
      await this.prisma.quote.findUnique({
        where: {
          id,
        },
      });

    if (!quote) {
      throw new NotFoundException(
        'Devis introuvable.',
      );
    }

    // -------------------------------------------------------
    // Éviter de supprimer un devis accepté
    // -------------------------------------------------------

    if (
      quote.statut === 'ACCEPTE'
    ) {
      throw new BadRequestException(
        'Un devis accepté ne peut pas être supprimé.',
      );
    }

    await this.prisma.quote.delete({
      where: {
        id,
      },
    });

    return {
      message:
        'Devis supprimé avec succès.',
    };
  }
}