import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =========================================================
  // CREATE
  // POST /addresses
  // =========================================================

  /**
   * Crée une nouvelle adresse.
   *
   * Une adresse peut être liée :
   * - à un client
   * - à un fournisseur
   * - ou être indépendante.
   */
  async create(
    createAddressDto: CreateAddressDto,
  ) {
    const {
      displayName,
      attention,
      line1,
      line2,
      line3,
      city,
      province,
      postalCode,
      country,
      telephone,
      contactName,
      contactPhone,
      contactEmail,
      clientId,
      supplierId,
    } = createAddressDto;

    // -------------------------------------------------------
    // Vérifier qu'un seul propriétaire est défini
    // -------------------------------------------------------

    if (clientId && supplierId) {
      throw new BadRequestException(
        'Une adresse ne peut pas être liée simultanément à un client et à un fournisseur.',
      );
    }

    // -------------------------------------------------------
    // Vérifier le client
    // -------------------------------------------------------

    if (clientId) {
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
    // Vérifier le fournisseur
    // -------------------------------------------------------

    if (supplierId) {
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
    // Création
    // -------------------------------------------------------

    try {
      return await this.prisma.address.create({
        data: {
          displayName,
          attention,
          line1,
          line2,
          line3,
          city,
          province,
          postalCode,
          country,
          telephone,
          contactName,
          contactPhone,
          contactEmail,
          clientId,
          supplierId,
        },

        include: {
          client: true,
          supplier: true,
        },
      });
    } catch (error) {
      console.error(
        'Erreur lors de la création de l’adresse :',
        error,
      );

      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la création de l’adresse.',
      );
    }
  }

  // =========================================================
  // FIND ALL
  // GET /addresses
  // =========================================================

  /**
   * Retourne toutes les adresses.
   */
  async findAll() {
    return this.prisma.address.findMany({
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
  // GET /addresses/:id
  // =========================================================

  /**
   * Retourne une adresse par son ID.
   */
  async findById(id: number) {
    const address =
      await this.prisma.address.findUnique({
        where: {
          id,
        },

        include: {
          client: true,
          supplier: true,
        },
      });

    if (!address) {
      throw new NotFoundException(
        'Adresse introuvable.',
      );
    }

    return address;
  }

  // =========================================================
  // FIND BY CLIENT
  // GET /addresses/client/:clientId
  // =========================================================

  /**
   * Retourne toutes les adresses d'un client.
   */
  async findByClient(clientId: number) {
    // Vérifier que le client existe
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

    return this.prisma.address.findMany({
      where: {
        clientId,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // =========================================================
  // FIND BY SUPPLIER
  // GET /addresses/supplier/:supplierId
  // =========================================================

  /**
   * Retourne toutes les adresses d'un fournisseur.
   */
  async findBySupplier(
    supplierId: number,
  ) {
    // Vérifier que le fournisseur existe
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

    return this.prisma.address.findMany({
      where: {
        supplierId,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // =========================================================
  // UPDATE
  // PATCH /addresses/:id
  // =========================================================

  /**
   * Modifie une adresse.
   */
  async update(
    id: number,
    updateAddressDto: UpdateAddressDto,
  ) {
    // Vérifier que l'adresse existe
    await this.findById(id);

    const {
      clientId,
      supplierId,
      ...addressData
    } = updateAddressDto;

    // -------------------------------------------------------
    // Vérifier les relations
    // -------------------------------------------------------

    if (clientId && supplierId) {
      throw new BadRequestException(
        'Une adresse ne peut pas être liée simultanément à un client et à un fournisseur.',
      );
    }

    // -------------------------------------------------------
    // Vérifier le client
    // -------------------------------------------------------

    if (clientId) {
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
    // Vérifier le fournisseur
    // -------------------------------------------------------

    if (supplierId) {
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

    return this.prisma.address.update({
      where: {
        id,
      },

      data: {
        ...addressData,
        ...(clientId !== undefined && {
          clientId,
        }),
        ...(supplierId !== undefined && {
          supplierId,
        }),
      },

      include: {
        client: true,
        supplier: true,
      },
    });
  }

  // =========================================================
  // DELETE
  // DELETE /addresses/:id
  // =========================================================

  /**
   * Supprime une adresse.
   */
  async remove(id: number) {
    // Vérifier que l'adresse existe
    await this.findById(id);

    await this.prisma.address.delete({
      where: {
        id,
      },
    });

    return {
      message:
        'Adresse supprimée avec succès.',
    };
  }
}