import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import {
  ProductStatut,
  UOM,
} from '@prisma/client';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =========================================================
  // CREATE
  // POST /products
  // =========================================================

  /**
   * Crée un nouveau produit.
   *
   * Le produit doit être associé à :
   * - un Supplier existant
   * - une Category existante
   */
  async create(
    createProductDto: CreateProductDto,
  ) {
    const {
      nom,
      description,
      specifications,
      supplierId,
      categoryId,
      uom,
      moq,
      quantityMinimum,
      quantityMultiples,
      quantityMasterPack,
      dimensionLongueur,
      dimensionLargeur,
      dimensionHauteur,
      dimensionPoids,
      basePrice,
      cost,
      msrp,
      leadTime,
    } = createProductDto;

    // -------------------------------------------------------
    // 1. Vérifier le nom
    // -------------------------------------------------------

    const normalizedNom =
      nom.trim();

    if (!normalizedNom) {
      throw new BadRequestException(
        'Le nom du produit est obligatoire.',
      );
    }

    // -------------------------------------------------------
    // 2. Vérifier le Supplier
    // -------------------------------------------------------

    const supplier =
      await this.prisma.supplier.findUnique({
        where: {
          id: supplierId,
        },
      });

    if (!supplier) {
      throw new BadRequestException(
        'Le fournisseur spécifié est introuvable.',
      );
    }

    // -------------------------------------------------------
    // 3. Vérifier la Category
    // -------------------------------------------------------

    const category =
      await this.prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });

    if (!category) {
      throw new BadRequestException(
        'La catégorie spécifiée est introuvable.',
      );
    }

    // -------------------------------------------------------
    // 4. Vérifier les doublons
    // -------------------------------------------------------

    const existingProduct =
      await this.prisma.product.findFirst({
        where: {
          nom: normalizedNom,
          supplierId,
        },
      });

    if (existingProduct) {
      throw new BadRequestException(
        'Ce produit existe déjà pour ce fournisseur.',
      );
    }

    // -------------------------------------------------------
    // 5. Création
    // -------------------------------------------------------

    try {
      return await this.prisma.product.create({
        data: {
          nom: normalizedNom,

          description:
            description?.trim() || null,

          specifications:
            specifications?.trim() || null,

          supplierId,
          categoryId,
          uom,

          moq,
          quantityMinimum,
          quantityMultiples,
          quantityMasterPack,

          dimensionLongueur,
          dimensionLargeur,
          dimensionHauteur,
          dimensionPoids,

          basePrice,
          cost,
          msrp,

          leadTime,
        },

        include: {
          supplier: true,
          category: true,
        },
      });
    } catch (error) {
      console.error(
        'Erreur lors de la création du produit :',
        error,
      );

      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la création du produit.',
      );
    }
  }

  // =========================================================
  // FIND ALL
  // GET /products
  // =========================================================

  /**
   * Retourne la liste paginée des produits.
   */
  async findAll(
    page = 1,
    limit = 20,
  ) {
    const skip =
      (page - 1) * limit;

    const [products, total] =
      await Promise.all([
        this.prisma.product.findMany({
          skip,
          take: limit,

          orderBy: {
            createdAt: 'desc',
          },

          include: {
            supplier: true,
            category: true,
          },
        }),

        this.prisma.product.count(),
      ]);

    return {
      data: products,

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
  // GET /products/:id
  // =========================================================

  /**
   * Retourne un produit par son ID.
   */
  async findById(id: number) {
    const product =
      await this.prisma.product.findUnique({
        where: {
          id,
        },

        include: {
          supplier: true,
          category: true,
          images: true,
        },
      });

    if (!product) {
      throw new NotFoundException(
        'Produit introuvable.',
      );
    }

    return product;
  }

  // =========================================================
  // FIND BY CATEGORY
  // GET /products/category/:categoryId
  // =========================================================

  /**
   * Retourne les produits d'une catégorie.
   */
  async findByCategory(
    categoryId: number,
  ) {
    const category =
      await this.prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });

    if (!category) {
      throw new NotFoundException(
        'Catégorie introuvable.',
      );
    }

    return this.prisma.product.findMany({
      where: {
        categoryId,
      },

      orderBy: {
        nom: 'asc',
      },

      include: {
        supplier: true,
        category: true,
      },
    });
  }

  // =========================================================
  // FIND BY SUPPLIER
  // GET /products/supplier/:supplierId
  // =========================================================

  /**
   * Retourne les produits d'un fournisseur.
   */
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

    return this.prisma.product.findMany({
      where: {
        supplierId,
      },

      orderBy: {
        nom: 'asc',
      },

      include: {
        supplier: true,
        category: true,
      },
    });
  }

  // =========================================================
  // UPDATE
  // PATCH /products/:id
  // =========================================================

  /**
   * Modifie les informations d'un produit.
   */
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ) {
    // -------------------------------------------------------
    // 1. Vérifier le produit
    // -------------------------------------------------------

    const currentProduct =
      await this.prisma.product.findUnique({
        where: {
          id,
        },
      });

    if (!currentProduct) {
      throw new NotFoundException(
        'Produit introuvable.',
      );
    }

    const {
      nom,
      description,
      specifications,
      supplierId,
      categoryId,
      uom,
      moq,
      quantityMinimum,
      quantityMultiples,
      quantityMasterPack,
      dimensionLongueur,
      dimensionLargeur,
      dimensionHauteur,
      dimensionPoids,
      basePrice,
      cost,
      msrp,
      leadTime,
    } = updateProductDto;

    // -------------------------------------------------------
    // 2. Préparer les données
    // -------------------------------------------------------

    const data: {
      nom?: string;
      description?: string | null;
      specifications?: string | null;

      supplierId?: number;
      categoryId?: number;

      uom?: UOM;

      moq?: number | null;
      quantityMinimum?: number | null;
      quantityMultiples?: number | null;
      quantityMasterPack?: number | null;

      dimensionLongueur?: any;
      dimensionLargeur?: any;
      dimensionHauteur?: any;
      dimensionPoids?: any;

      basePrice?: any;
      cost?: any;
      msrp?: any;

      leadTime?: number | null;
    } = {};

    // -------------------------------------------------------
    // 3. Informations générales
    // -------------------------------------------------------

    if (nom !== undefined) {
      const normalizedNom =
        nom.trim();

      if (!normalizedNom) {
        throw new BadRequestException(
          'Le nom du produit ne peut pas être vide.',
        );
      }

      data.nom =
        normalizedNom;
    }

    if (description !== undefined) {
      data.description =
        description?.trim() || null;
    }

    if (specifications !== undefined) {
      data.specifications =
        specifications?.trim() || null;
    }

    if (uom !== undefined) {
      data.uom = uom;
    }

    // -------------------------------------------------------
    // 4. Quantités
    // -------------------------------------------------------

    if (moq !== undefined) {
      data.moq = moq;
    }

    if (
      quantityMinimum !== undefined
    ) {
      data.quantityMinimum =
        quantityMinimum;
    }

    if (
      quantityMultiples !== undefined
    ) {
      data.quantityMultiples =
        quantityMultiples;
    }

    if (
      quantityMasterPack !== undefined
    ) {
      data.quantityMasterPack =
        quantityMasterPack;
    }

    // -------------------------------------------------------
    // 5. Dimensions
    // -------------------------------------------------------

    if (
      dimensionLongueur !== undefined
    ) {
      data.dimensionLongueur =
        dimensionLongueur;
    }

    if (
      dimensionLargeur !== undefined
    ) {
      data.dimensionLargeur =
        dimensionLargeur;
    }

    if (
      dimensionHauteur !== undefined
    ) {
      data.dimensionHauteur =
        dimensionHauteur;
    }

    if (
      dimensionPoids !== undefined
    ) {
      data.dimensionPoids =
        dimensionPoids;
    }

    // -------------------------------------------------------
    // 6. Prix
    // -------------------------------------------------------

    if (basePrice !== undefined) {
      data.basePrice =
        basePrice;
    }

    if (cost !== undefined) {
      data.cost = cost;
    }

    if (msrp !== undefined) {
      data.msrp = msrp;
    }

    if (leadTime !== undefined) {
      data.leadTime = leadTime;
    }

    // -------------------------------------------------------
    // 7. Vérifier le Supplier
    // -------------------------------------------------------

    if (
      supplierId !== undefined
    ) {
      const supplier =
        await this.prisma.supplier.findUnique({
          where: {
            id: supplierId,
          },
        });

      if (!supplier) {
        throw new BadRequestException(
          'Le fournisseur spécifié est introuvable.',
        );
      }

      data.supplierId =
        supplierId;
    }

    // -------------------------------------------------------
    // 8. Vérifier la Category
    // -------------------------------------------------------

    if (
      categoryId !== undefined
    ) {
      const category =
        await this.prisma.category.findUnique({
          where: {
            id: categoryId,
          },
        });

      if (!category) {
        throw new BadRequestException(
          'La catégorie spécifiée est introuvable.',
        );
      }

      data.categoryId =
        categoryId;
    }

    // -------------------------------------------------------
    // 9. Vérifier les doublons
    // -------------------------------------------------------

    if (
      data.nom !== undefined ||
      data.supplierId !== undefined
    ) {
      const existingProduct =
        await this.prisma.product.findFirst({
          where: {
            nom:
              data.nom ??
              currentProduct.nom,

            supplierId:
              data.supplierId ??
              currentProduct.supplierId,

            NOT: {
              id,
            },
          },
        });

      if (existingProduct) {
        throw new BadRequestException(
          'Ce produit existe déjà pour ce fournisseur.',
        );
      }
    }

    // -------------------------------------------------------
    // 10. Mise à jour
    // -------------------------------------------------------

    return this.prisma.product.update({
      where: {
        id,
      },

      data,

      include: {
        supplier: true,
        category: true,
        images: true,
      },
    });
  }

  // =========================================================
  // UPDATE STATUS
  // PATCH /products/:id/status
  // =========================================================

  /**
   * Active, désactive ou met un produit en rupture.
   */
  async updateStatus(
    id: number,
    statut: ProductStatut,
  ) {
    await this.findById(id);

    return this.prisma.product.update({
      where: {
        id,
      },

      data: {
        statut,
      },

      include: {
        supplier: true,
        category: true,
      },
    });
  }

  // =========================================================
  // DELETE
  // DELETE /products/:id
  // =========================================================

  /**
   * Supprime définitivement un produit.
   */
  async remove(id: number) {
    await this.findById(id);

    try {
      await this.prisma.product.delete({
        where: {
          id,
        },
      });

      return {
        message:
          'Produit supprimé avec succès.',
      };
    } catch (error) {
      console.error(
        'Erreur lors de la suppression du produit :',
        error,
      );

      throw new BadRequestException(
        'Impossible de supprimer ce produit. Il peut être utilisé dans une commande.',
      );
    }
  }
}