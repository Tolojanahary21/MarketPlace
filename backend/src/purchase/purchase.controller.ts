import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  Role,
} from '@prisma/client';

import {
  PurchaseOrderService,
} from './purchase.service';

import {
  CreatePurchaseOrderDto,
} from './dto/create-purchase-order.dto';

import {
  UpdatePurchaseOrderDto,
} from './dto/update-purchase-order.dto';

import {
  UpdatePurchaseOrderStatusDto,
} from './dto/update-purchase-order-status.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';







@ApiTags('Purchase Orders')
@ApiBearerAuth('access-token')
@Controller('purchase-orders')
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class PurchaseOrderController {
  constructor(
    private readonly purchaseOrderService: PurchaseOrderService,
  ) {}

  // ======================================================
  // CREATE
  // POST /purchase-orders
  // ======================================================

  @Post()
  @Roles(
    Role.ADMIN,
    Role.VENDEUR,
  )
  @ApiOperation({
    summary:
      'Créer un bon de commande',
    description:
      'Crée un nouveau bon de commande.',
  })
  @ApiResponse({
    status: 201,
    description:
      'Bon de commande créé avec succès.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Numéro PO déjà utilisé ou données invalides.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Utilisateur non authentifié.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Accès réservé aux administrateurs et vendeurs.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Client, fournisseur ou devis introuvable.',
  })
  create(
    @Body()
    createPurchaseOrderDto: CreatePurchaseOrderDto,
  ) {
    return this.purchaseOrderService.create(
      createPurchaseOrderDto,
    );
  }

  // ======================================================
  // FIND ALL
  // GET /purchase-orders
  // ======================================================

  @Get()
  @Roles(
    Role.ADMIN,
    Role.VENDEUR,
    Role.ACHETEUR,
  )
  @ApiOperation({
    summary:
      'Lister les bons de commande',
    description:
      'Retourne la liste paginée des bons de commande.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Liste récupérée avec succès.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Utilisateur non authentifié.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Accès non autorisé.',
  })
  findAll() {
    return this.purchaseOrderService.findAll();
  }

  // ======================================================
  // FIND ONE
  // GET /purchase-orders/:id
  // ======================================================

  @Get(':id')
  @Roles(
    Role.ADMIN,
    Role.VENDEUR,
    Role.ACHETEUR,
  )
  @ApiOperation({
    summary:
      'Récupérer un bon de commande',
    description:
      'Retourne les détails d’un bon de commande.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description:
      'ID du bon de commande.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Bon de commande récupéré avec succès.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Bon de commande introuvable.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Utilisateur non authentifié.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Accès non autorisé.',
  })
  findOne(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.purchaseOrderService.findOne(
      id,
    );
  }

  // ======================================================
  // FIND BY PO NUMBER
  // GET /purchase-orders/number/:poNumber
  // ======================================================

  @Get('number/:poNumber')
  @Roles(
    Role.ADMIN,
    Role.VENDEUR,
    Role.ACHETEUR,
  )
  @ApiOperation({
    summary:
      'Rechercher un bon de commande par numéro',
  })
  @ApiParam({
    name: 'poNumber',
    example: 'PO-2026-0001',
  })
  @ApiResponse({
    status: 200,
    description:
      'Bon de commande trouvé.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Bon de commande introuvable.',
  })
  findByPoNumber(
    @Param('poNumber')
    poNumber: string,
  ) {
    return this.purchaseOrderService.findByPoNumber(
      poNumber,
    );
  }

  // ======================================================
  // UPDATE
  // PATCH /purchase-orders/:id
  // ======================================================

  @Patch(':id')
  @Roles(
    Role.ADMIN,
    Role.VENDEUR,
  )
  @ApiOperation({
    summary:
      'Modifier un bon de commande',
    description:
      'Modifie les informations d’un bon de commande.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description:
      'Bon de commande modifié avec succès.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Données invalides ou numéro déjà utilisé.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Bon de commande introuvable.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Utilisateur non authentifié.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Accès réservé aux administrateurs et vendeurs.',
  })
  update(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Body()
    updatePurchaseOrderDto: UpdatePurchaseOrderDto,
  ) {
    return this.purchaseOrderService.update(
      id,
      updatePurchaseOrderDto,
    );
  }

  // ======================================================
  // UPDATE STATUS
  // PATCH /purchase-orders/:id/status
  // ======================================================

  @Patch(':id/status')
  @Roles(
    Role.ADMIN,
    Role.VENDEUR,
  )
  @ApiOperation({
    summary:
      'Modifier le statut du bon de commande',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description:
      'Statut modifié avec succès.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Statut invalide.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Bon de commande introuvable.',
  })
  updateStatus(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Body()
    dto: UpdatePurchaseOrderStatusDto,
  ) {
    return this.purchaseOrderService.updateStatus(
      id,
      dto.statut,
    );
  }

  // ======================================================
  // DELETE
  // DELETE /purchase-orders/:id
  // ======================================================

  @Delete(':id')
  @Roles(
    Role.ADMIN,
  )
  @ApiOperation({
    summary:
      'Supprimer un bon de commande',
    description:
      'Supprime définitivement un bon de commande.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description:
      'Bon de commande supprimé avec succès.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Utilisateur non authentifié.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Suppression réservée aux administrateurs.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Bon de commande introuvable.',
  })
  remove(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.purchaseOrderService.remove(
      id,
    );
  }
}
