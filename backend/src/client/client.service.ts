import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { UpdateClientStatusDto } from './dto/update-client-status.dto';


@Injectable()
export class ClientService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =========================================================
  // CREATE
  // POST /clients
  // =========================================================

  /**
   * Créer un nouveau client.
   */
  async create(
    createClientDto: CreateClientDto,
  ) {
    const displayName =
      createClientDto.displayName.trim();

    const entreprise =
      createClientDto.entreprise?.trim() || null;

    const telephone2 =
      createClientDto.telephone2?.trim() || null;

    // -------------------------------------------------------
    // Vérifications
    // -------------------------------------------------------

    if (!displayName) {
      throw new BadRequestException(
        'Le nom du client est obligatoire.',
      );
    }

    // -------------------------------------------------------
    // Création
    // -------------------------------------------------------

    try {
      return await this.prisma.client.create({
        data: {
          displayName,
          entreprise,
          telephone2,
          type: createClientDto.type,
        },

        select: this.publicClientSelect(),
      });
    } catch (error) {
      console.error(
        'Erreur lors de la création du client :',
        error,
      );

      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la création du client.',
      );
    }
  }

  // =========================================================
  // FIND ALL
  // GET /clients
  // =========================================================

  /**
   * Retourne la liste des clients.
   *
   * Exemple :
   * GET /clients?page=1&limit=20
   */
  async findAll(
    page = 1,
    limit = 20,
  ) {
    // Éviter les valeurs incorrectes
    page = Math.max(1, page);
    limit = Math.min(
      Math.max(1, limit),
      100,
    );

    const skip =
      (page - 1) * limit;

    const [
      clients,
      total,
    ] = await Promise.all([
      this.prisma.client.findMany({
        skip,
        take: limit,

        orderBy: {
          createdAt: 'desc',
        },

        select:
          this.publicClientSelect(),
      }),

      this.prisma.client.count(),
    ]);

    return {
      data: clients,

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
  // GET /clients/:id
  // =========================================================

  /**
   * Retourne un client par son ID.
   */
  async findById(id: number) {
    const client =
      await this.prisma.client.findUnique({
        where: {
          id,
        },

        select:
          this.publicClientSelect(),
      });

    if (!client) {
      throw new NotFoundException(
        'Client introuvable.',
      );
    }

    return client;
  }

  // =========================================================
  // SEARCH
  // GET /clients/search
  // =========================================================

  /**
   * Recherche des clients par :
   * - nom
   * - entreprise
   * - téléphone
   */
  async search(
    search: string,
  ) {
    const value =
      search.trim();

    if (!value) {
      throw new BadRequestException(
        'Le terme de recherche est obligatoire.',
      );
    }

    return this.prisma.client.findMany({
      where: {
        OR: [
          {
            displayName: {
              contains: value,
              mode: 'insensitive',
            },
          },
          {
            entreprise: {
              contains: value,
              mode: 'insensitive',
            },
          },
          {
            telephone2: {
              contains: value,
              mode: 'insensitive',
            },
          },
        ],
      },

      orderBy: {
        displayName: 'asc',
      },

      select:
        this.publicClientSelect(),
    });
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
        this.publicClientSelect(),
    });
  }
  // =========================================================
  // UPDATE
  // PATCH /clients/:id
  // =========================================================

  /**
   * Modifier les informations générales
   * d'un client.
   *
   * Le statut est modifié séparément.
   */
  async update(
    id: number,
    updateClientDto: UpdateClientDto,
  ) {
    // Vérifier que le client existe
    await this.findById(id);

    const data: {
      displayName?: string;
      entreprise?: string | null;
      telephone2?: string | null;
      type?: typeof updateClientDto.type;
    } = {};

    // -------------------------------------------------------
    // Display name
    // -------------------------------------------------------

    if (
      updateClientDto.displayName !==
      undefined
    ) {
      const displayName =
        updateClientDto.displayName.trim();

      if (!displayName) {
        throw new BadRequestException(
          'Le nom du client ne peut pas être vide.',
        );
      }

      data.displayName =
        displayName;
    }

    // -------------------------------------------------------
    // Entreprise
    // -------------------------------------------------------

    if (
      updateClientDto.entreprise !==
      undefined
    ) {
      data.entreprise =
        updateClientDto.entreprise?.trim() ||
        null;
    }


    // -------------------------------------------------------
    // Téléphone secondaire
    // -------------------------------------------------------

    if (
      updateClientDto.telephone2 !==
      undefined
    ) {
      data.telephone2 =
        updateClientDto.telephone2?.trim() ||
        null;
    }

    // -------------------------------------------------------
    // Type
    // -------------------------------------------------------

    if (
      updateClientDto.type !==
      undefined
    ) {
      data.type =
        updateClientDto.type;
    }

    return this.prisma.client.update({
      where: {
        id,
      },

      data,

      select:
        this.publicClientSelect(),
    });
  }

  // =========================================================
  // UPDATE STATUS
  // PATCH /clients/:id/status
  // =========================================================

  /**
   * Active ou désactive un client.
   */
  async updateStatus(
    id: number,
    dto: UpdateClientStatusDto,
  ) {
    await this.findById(id);

    return this.prisma.client.update({
      where: {
        id,
      },

      data: {
        statut: dto.statut,
      },

      select:
        this.publicClientSelect(),
    });
  }

  // =========================================================
  // DELETE
  // DELETE /clients/:id
  // =========================================================

  /**
   * Supprime définitivement un client.
   */
  async remove(id: number) {
    await this.findById(id);

    try {
      await this.prisma.client.delete({
        where: {
          id,
        },
      });

      return {
        message:
          'Client supprimé avec succès.',
      };
    } catch (error) {
      console.error(
        'Erreur lors de la suppression du client :',
        error,
      );

      throw new BadRequestException(
        'Impossible de supprimer ce client. Il est peut-être utilisé par un devis, une commande ou une autre ressource.',
      );
    }
  }

  // =========================================================
  // PUBLIC CLIENT SELECT
  // =========================================================

  /**
   * Champs retournés au frontend.
   */
  private publicClientSelect() {
    return {
      id: true,
      displayName: true,
      entreprise: true,
      telephone2: true,
      statut: true,
      type: true,
      createdAt: true,
      updatedAt: true,
    } as const;
  }
}