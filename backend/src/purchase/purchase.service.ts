
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';

@Injectable()
export class PurchaseOrderService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // ======================================================
  // CREATE
  // POST /purchase-orders
  // ======================================================

  async create(
    createPurchaseOrderDto: CreatePurchaseOrderDto,
  ) {
    const {
      poNumber,
      quoteId,
      clientId,
      supplierId,
      ...data
    } = createPurchaseOrderDto;

    // ----------------------------------------------------
    // Vérifier le numéro PO
    // ----------------------------------------------------

    const existingPO =
      await this.prisma.purchaseOrder.findUnique({
        where: {
          poNumber,
        },
      });

    if (existingPO) {
      throw new BadRequestException(
        'Ce numéro de bon de commande existe déjà.',
      );
    }

    // ----------------------------------------------------
    // Vérifier le client
    // ----------------------------------------------------

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

    // ----------------------------------------------------
    // Vérifier le fournisseur
    // ----------------------------------------------------

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

    // ----------------------------------------------------
    // Vérifier le devis si fourni
    // ----------------------------------------------------

    if (quoteId !== undefined && quoteId !== null) {
      const quote =
        await this.prisma.quote.findUnique({
          where: {
            id: quoteId,
          },
        });

      if (!quote) {
        throw new NotFoundException(
          'Devis introuvable.',
        );
      }

      // Un devis ne peut être associé
      // qu'à un seul PurchaseOrder.
      const existingQuotePO =
        await this.prisma.purchaseOrder.findUnique({
          where: {
            quoteId,
          },
        });

      if (existingQuotePO) {
        throw new BadRequestException(
          'Ce devis est déjà associé à un bon de commande.',
        );
      }
    }

    // ----------------------------------------------------
    // Création
    // ----------------------------------------------------

    try {
      return await this.prisma.purchaseOrder.create({
        data: {
          poNumber,
          quoteId: quoteId ?? null,
          clientId,
          supplierId,

          ...data,
        },

        include: {
          quote: true,
          client: true,
          supplier: true,
          items: true,
        },
      });
    } catch (error) {
      console.error(
        'Erreur création PurchaseOrder:',
        error,
      );

      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la création du bon de commande.',
      );
    }
  }

  // ======================================================
  // FIND ALL
  // GET /purchase-orders
  // ======================================================

  async findAll(
    page = 1,
    limit = 20,
  ) {
    const skip =
      (page - 1) * limit;

    const [
      purchaseOrders,
      total,
    ] = await Promise.all([
      this.prisma.purchaseOrder.findMany({
        skip,
        take: limit,

        orderBy: {
          createdAt: 'desc',
        },

        include: {
          quote: true,
          client: true,
          supplier: true,
          items: true,
        },
      }),

      this.prisma.purchaseOrder.count(),
    ]);

    return {
      data: purchaseOrders,

      meta: {
        page,
        limit,
        total,
        totalPages:
          Math.ceil(total / limit),
      },
    };
  }

  // ======================================================
  // FIND ONE
  // GET /purchase-orders/:id
  // ======================================================

  async findOne(id: number) {
    const purchaseOrder =
      await this.prisma.purchaseOrder.findUnique({
        where: {
          id,
        },

        include: {
          quote: true,
          client: true,
          supplier: true,
          items: true,
        },
      });

    if (!purchaseOrder) {
      throw new NotFoundException(
        'Bon de commande introuvable.',
      );
    }

    return purchaseOrder;
  }

  // ======================================================
  // FIND BY PO NUMBER
  // ======================================================

  async findByPoNumber(
    poNumber: string,
  ) {
    const purchaseOrder =
      await this.prisma.purchaseOrder.findUnique({
        where: {
          poNumber,
        },

        include: {
          quote: true,
          client: true,
          supplier: true,
          items: true,
        },
      });

    if (!purchaseOrder) {
      throw new NotFoundException(
        'Bon de commande introuvable.',
      );
    }

    return purchaseOrder;
  }

  // ======================================================
  // UPDATE
  // PATCH /purchase-orders/:id
  // ======================================================

  async update(
    id: number,
    updatePurchaseOrderDto: UpdatePurchaseOrderDto,
  ) {
    // Vérifier l'existence
    await this.findOne(id);

    const {
      poNumber,
      quoteId,
      clientId,
      supplierId,
      ...data
    } = updatePurchaseOrderDto;

    // ----------------------------------------------------
    // Vérifier le PO Number
    // ----------------------------------------------------

    if (poNumber !== undefined) {
      const existingPO =
        await this.prisma.purchaseOrder.findFirst({
          where: {
            poNumber,
            NOT: {
              id,
            },
          },
        });

      if (existingPO) {
        throw new BadRequestException(
          'Ce numéro de bon de commande existe déjà.',
        );
      }
    }

    // ----------------------------------------------------
    // Vérifier le client
    // ----------------------------------------------------

    if (clientId !== undefined) {
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

    // ----------------------------------------------------
    // Vérifier le fournisseur
    // ----------------------------------------------------

    if (supplierId !== undefined) {
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

    // ----------------------------------------------------
    // Vérifier le devis
    // ----------------------------------------------------

    if (
      quoteId !== undefined &&
      quoteId !== null
    ) {
      const quote =
        await this.prisma.quote.findUnique({
          where: {
            id: quoteId,
          },
        });

      if (!quote) {
        throw new NotFoundException(
          'Devis introuvable.',
        );
      }

      const existingQuotePO =
        await this.prisma.purchaseOrder.findFirst({
          where: {
            quoteId,
            NOT: {
              id,
            },
          },
        });

      if (existingQuotePO) {
        throw new BadRequestException(
          'Ce devis est déjà associé à un autre bon de commande.',
        );
      }
    }

    // ----------------------------------------------------
    // Mise à jour
    // ----------------------------------------------------

    return this.prisma.purchaseOrder.update({
      where: {
        id,
      },

      data: {
        ...(poNumber !== undefined && {
          poNumber,
        }),

        ...(quoteId !== undefined && {
          quoteId,
        }),

        ...(clientId !== undefined && {
          clientId,
        }),

        ...(supplierId !== undefined && {
          supplierId,
        }),

        ...data,
      },

      include: {
        quote: true,
        client: true,
        supplier: true,
        items: true,
      },
    });
  }

  // ======================================================
  // UPDATE STATUS
  // PATCH /purchase-orders/:id/status
  // ======================================================

  async updateStatus(
    id: number,
    statut: any,
  ) {
    await this.findOne(id);

    return this.prisma.purchaseOrder.update({
      where: {
        id,
      },

      data: {
        statut,
      },

      include: {
        quote: true,
        client: true,
        supplier: true,
      },
    });
  }

  // ======================================================
  // DELETE
  // DELETE /purchase-orders/:id
  // ======================================================

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.purchaseOrder.delete({
      where: {
        id,
      },
    });

    return {
      message:
        'Bon de commande supprimé avec succès.',
    };
  }
}

