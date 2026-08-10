import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Role } from '@prisma/client';

import { POItemService } from './poitems.service';

import { CreatePOItemDto } from './dto/create-po-item.dto';
import { UpdatePOItemDto } from './dto/update-po-item.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';



@ApiTags('PO Items')
@ApiBearerAuth('access-token')
@Controller('po-items')
@UseGuards(JwtAuthGuard, RolesGuard)
export class POItemController {
  constructor(
    private readonly poItemService: POItemService,
  ) {}

  // =========================================================
  // CREATE
  // =========================================================

  @Post()
  @Roles(
    Role.ADMIN,
    Role.VENDEUR,
  )
  @ApiOperation({
    summary:
      'Créer une ligne de commande',
  })
  @ApiResponse({
    status: 201,
    description:
      'Ligne de commande créée avec succès.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Données invalides.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Produit ou bon de commande introuvable.',
  })
  create(
    @Body()
    dto: CreatePOItemDto,
  ) {
    return this.poItemService.create(dto);
  }

  // =========================================================
  // FIND ALL
  // =========================================================

  @Get()
  @Roles(
    Role.ADMIN,
    Role.VENDEUR,
    Role.ACHETEUR,
  )
  @ApiOperation({
    summary:
      'Lister les lignes de commande',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description:
      'Liste des lignes de commande.',
  })
  findAll(
    @Query('page')
    page = 1,

    @Query('limit')
    limit = 20,
  ) {
    return this.poItemService.findAll(
      Number(page),
      Number(limit),
    );
  }

  // =========================================================
  // FIND BY ID
  // =========================================================

  @Get(':id')
  @Roles(
    Role.ADMIN,
    Role.VENDEUR,
    Role.ACHETEUR,
  )
  @ApiOperation({
    summary:
      'Récupérer une ligne de commande',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description:
      'Ligne de commande trouvée.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Ligne de commande introuvable.',
  })
  findById(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.poItemService.findById(id);
  }

  // =========================================================
  // FIND BY PURCHASE ORDER
  // =========================================================

  @Get('purchase-order/:purchaseOrderId')
  @Roles(
    Role.ADMIN,
    Role.VENDEUR,
    Role.ACHETEUR,
  )
  @ApiOperation({
    summary:
      'Lister les lignes d’un bon de commande',
  })
  @ApiParam({
    name: 'purchaseOrderId',
    example: 1,
  })
  findByPurchaseOrder(
    @Param(
      'purchaseOrderId',
      ParseIntPipe,
    )
    purchaseOrderId: number,
  ) {
    return this.poItemService.findByPurchaseOrder(
      purchaseOrderId,
    );
  }

  // =========================================================
  // FIND BY PRODUCT
  // =========================================================

  @Get('product/:productId')
  @Roles(
    Role.ADMIN,
    Role.VENDEUR,
    Role.ACHETEUR,
  )
  @ApiOperation({
    summary:
      'Lister les commandes contenant un produit',
  })
  @ApiParam({
    name: 'productId',
    example: 1,
  })
  findByProduct(
    @Param(
      'productId',
      ParseIntPipe,
    )
    productId: number,
  ) {
    return this.poItemService.findByProduct(
      productId,
    );
  }

  // =========================================================
  // UPDATE
  // =========================================================

  @Patch(':id')
  @Roles(
    Role.ADMIN,
    Role.VENDEUR,
  )
  @ApiOperation({
    summary:
      'Modifier une ligne de commande',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description:
      'Ligne de commande modifiée avec succès.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Ligne de commande introuvable.',
  })
  update(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Body()
    dto: UpdatePOItemDto,
  ) {
    return this.poItemService.update(
      id,
      dto,
    );
  }

  // =========================================================
  // UPDATE STATUS
  // =========================================================

  @Patch(':id/status')
  @Roles(
    Role.ADMIN,
    Role.VENDEUR,
  )
  @ApiOperation({
    summary:
      'Modifier le statut d’une ligne de commande',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  updateStatus(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Body('statut')
    statut: any,
  ) {
    return this.poItemService.updateStatus(
      id,
      statut,
    );
  }

  // =========================================================
  // UPDATE FULFILLMENT STATUS
  // =========================================================

  @Patch(':id/fulfillment-status')
  @Roles(
    Role.ADMIN,
    Role.VENDEUR,
  )
  @ApiOperation({
    summary:
      'Modifier le statut de livraison',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  updateFulfillmentStatus(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Body('fulfillmentStatus')
    fulfillmentStatus: any,
  ) {
    return this.poItemService.updateFulfillmentStatus(
      id,
      fulfillmentStatus,
    );
  }

  // =========================================================
  // DELETE
  // =========================================================

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary:
      'Supprimer une ligne de commande',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description:
      'Ligne de commande supprimée avec succès.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Ligne de commande introuvable.',
  })
  remove(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.poItemService.remove(id);
  }
}