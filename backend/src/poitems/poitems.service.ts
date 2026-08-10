import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreatePOItemDto } from './dto/create-po-item.dto';
import { UpdatePOItemDto } from './dto/update-po-item.dto';

@Injectable()
export class POItemService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =========================================================
  // CREATE
  // POST /po-items
  // =========================================================

  async create(createPOItemDto: CreatePOItemDto) {
    const {
      purchaseOrderId,
      productId,
      quantity,
      price,
      statut,
      leadTime,
      fulfillmentStatus,
      notes,
      alerts,
    } = createPOItemDto;

    // -------------------------------------------------------
    // Vérifier la quantité
    // -------------------------------------------------------

    if (quantity <= 0) {
      throw new BadRequestException(
        'La quantité doit être supérieure à zéro.',
      );
    }

    // -------------------------------------------------------
    // Vérifier le PurchaseOrder
    // -------------------------------------------------------

    const purchaseOrder =
      await this.prisma.purchaseOrder.findUnique({
        where: {
          id: purchaseOrderId,
        },
      });

    if (!purchaseOrder) {
      throw new NotFoundException(
        'Bon de commande introuvable.',
      );
    }

    // -------------------------------------------------------
    // Vérifier le Product
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
    // Création
    // -------------------------------------------------------

    try {
      return await this.prisma.pOItem.create({
        data: {
          purchaseOrderId,
          productId,
          quantity,
          price,
          statut,
          leadTime,
          fulfillmentStatus,
          notes,
          alerts,
        },

        include: {
          purchaseOrder: true,
          product: true,
        },
      });
    } catch (error) {
      console.error(
        'Erreur création POItem:',
        error,
      );

      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la création de la ligne de commande.',
      );
    }
  }

  // =========================================================
  // FIND ALL
  // GET /po-items
  // =========================================================

  async findAll(
    page = 1,
    limit = 20,
  ) {
    const skip =
      (page - 1) * limit;

    const [items, total] =
      await Promise.all([
        this.prisma.pOItem.findMany({
          skip,
          take: limit,

          orderBy: {
            createdAt: 'desc',
          },

          include: {
            purchaseOrder: true,
            product: true,
          },
        }),

        this.prisma.pOItem.count(),
      ]);

    return {
      data: items,

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
  // FIND BY ID
  // GET /po-items/:id
  // =========================================================

  async findById(id: number) {
    const item =
      await this.prisma.pOItem.findUnique({
        where: {
          id,
        },

        include: {
          purchaseOrder: true,
          product: true,
        },
      });

    if (!item) {
      throw new NotFoundException(
        'Ligne de commande introuvable.',
      );
    }

    return item;
  }

  // =========================================================
  // FIND BY PURCHASE ORDER
  // GET /po-items/purchase-order/:purchaseOrderId
  // =========================================================

  async findByPurchaseOrder(
    purchaseOrderId: number,
  ) {
    // Vérifier le PurchaseOrder
    const purchaseOrder =
      await this.prisma.purchaseOrder.findUnique({
        where: {
          id: purchaseOrderId,
        },
      });

    if (!purchaseOrder) {
      throw new NotFoundException(
        'Bon de commande introuvable.',
      );
    }

    return this.prisma.pOItem.findMany({
      where: {
        purchaseOrderId,
      },

      orderBy: {
        createdAt: 'asc',
      },

      include: {
        product: true,
      },
    });
  }

  // =========================================================
  // FIND BY PRODUCT
  // GET /po-items/product/:productId
  // =========================================================

  async findByProduct(
    productId: number,
  ) {
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

    return this.prisma.pOItem.findMany({
      where: {
        productId,
      },

      orderBy: {
        createdAt: 'desc',
      },

      include: {
        purchaseOrder: true,
      },
    });
  }

  // =========================================================
  // UPDATE
  // PATCH /po-items/:id
  // =========================================================

  async update(
    id: number,
    updatePOItemDto: UpdatePOItemDto,
  ) {
    // Vérifier que l'item existe
    await this.findById(id);

    const data: {
      purchaseOrderId?: number;
      productId?: number;
      quantity?: number;
      price?: any;
      statut?: any;
      leadTime?: number | null;
      fulfillmentStatus?: any;
      notes?: string | null;
      alerts?: any;
    } = {};

    // -------------------------------------------------------
    // Purchase Order
    // -------------------------------------------------------

    if (
      updatePOItemDto.purchaseOrderId !==
      undefined
    ) {
      const purchaseOrder =
        await this.prisma.purchaseOrder.findUnique({
          where: {
            id:
              updatePOItemDto.purchaseOrderId,
          },
        });

      if (!purchaseOrder) {
        throw new NotFoundException(
          'Bon de commande introuvable.',
        );
      }

      data.purchaseOrderId =
        updatePOItemDto.purchaseOrderId;
    }

    // -------------------------------------------------------
    // Product
    // -------------------------------------------------------

    if (
      updatePOItemDto.productId !==
      undefined
    ) {
      const product =
        await this.prisma.product.findUnique({
          where: {
            id: updatePOItemDto.productId,
          },
        });

      if (!product) {
        throw new NotFoundException(
          'Produit introuvable.',
        );
      }

      data.productId =
        updatePOItemDto.productId;
    }

    // -------------------------------------------------------
    // Quantity
    // -------------------------------------------------------

    if (
      updatePOItemDto.quantity !==
      undefined
    ) {
      if (
        updatePOItemDto.quantity <= 0
      ) {
        throw new BadRequestException(
          'La quantité doit être supérieure à zéro.',
        );
      }

      data.quantity =
        updatePOItemDto.quantity;
    }

    // -------------------------------------------------------
    // Price
    // -------------------------------------------------------

    if (
      updatePOItemDto.price !==
      undefined
    ) {
      data.price =
        updatePOItemDto.price;
    }

    // -------------------------------------------------------
    // Statut
    // -------------------------------------------------------

    if (
      updatePOItemDto.statut !==
      undefined
    ) {
      data.statut =
        updatePOItemDto.statut;
    }

    // -------------------------------------------------------
    // Lead time
    // -------------------------------------------------------

    if (
      updatePOItemDto.leadTime !==
      undefined
    ) {
      data.leadTime =
        updatePOItemDto.leadTime;
    }

    // -------------------------------------------------------
    // Fulfillment status
    // -------------------------------------------------------

    if (
      updatePOItemDto.fulfillmentStatus !==
      undefined
    ) {
      data.fulfillmentStatus =
        updatePOItemDto.fulfillmentStatus;
    }

    // -------------------------------------------------------
    // Notes
    // -------------------------------------------------------

    if (
      updatePOItemDto.notes !==
      undefined
    ) {
      data.notes =
        updatePOItemDto.notes;
    }

    // -------------------------------------------------------
    // Alerts
    // -------------------------------------------------------

    if (
      updatePOItemDto.alerts !==
      undefined
    ) {
      data.alerts =
        updatePOItemDto.alerts;
    }

    return this.prisma.pOItem.update({
      where: {
        id,
      },

      data,

      include: {
        purchaseOrder: true,
        product: true,
      },
    });
  }

  // =========================================================
  // UPDATE STATUS
  // PATCH /po-items/:id/status
  // =========================================================

  async updateStatus(
    id: number,
    statut: any,
  ) {
    await this.findById(id);

    return this.prisma.pOItem.update({
      where: {
        id,
      },

      data: {
        statut,
      },

      include: {
        product: true,
      },
    });
  }

  // =========================================================
  // UPDATE FULFILLMENT STATUS
  // PATCH /po-items/:id/fulfillment-status
  // =========================================================

  async updateFulfillmentStatus(
    id: number,
    fulfillmentStatus: any,
  ) {
    await this.findById(id);

    return this.prisma.pOItem.update({
      where: {
        id,
      },

      data: {
        fulfillmentStatus,
      },

      include: {
        product: true,
      },
    });
  }

  // =========================================================
  // DELETE
  // DELETE /po-items/:id
  // =========================================================

  async remove(id: number) {
    await this.findById(id);

    await this.prisma.pOItem.delete({
      where: {
        id,
      },
    });

    return {
      message:
        'Ligne de commande supprimée avec succès.',
    };
  }
}