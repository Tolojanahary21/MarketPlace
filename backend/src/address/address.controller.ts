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

import { Role } from '@prisma/client';

import { AddressService } from './address.service';

import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';



@ApiTags('Addresses')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('addresses')
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
  ) {}

  // =========================================================
  // CREATE
  // POST /addresses
  // =========================================================

  @Post()
  @Roles(
    Role.ADMIN,
    Role.ACHETEUR,
    Role.VENDEUR,
  )
  @ApiOperation({
    summary: 'Créer une adresse',
    description:
      'Crée une adresse pour un client ou un fournisseur.',
  })
  @ApiResponse({
    status: 201,
    description: 'Adresse créée avec succès.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Données invalides ou client et fournisseur renseignés simultanément.',
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non authentifié.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Permissions insuffisantes.',
  })
  create(
    @Body()
    createAddressDto: CreateAddressDto,
  ) {
    return this.addressService.create(
      createAddressDto,
    );
  }

  // =========================================================
  // FIND ALL
  // GET /addresses
  // =========================================================

  @Get()
  @Roles(
    Role.ADMIN,
    Role.ACHETEUR,
    Role.VENDEUR,
  )
  @ApiOperation({
    summary: 'Lister les adresses',
  })
  @ApiResponse({
    status: 200,
    description:
      'Liste des adresses récupérée avec succès.',
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non authentifié.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Permissions insuffisantes.',
  })
  findAll() {
    return this.addressService.findAll();
  }

  // =========================================================
  // FIND ONE
  // GET /addresses/:id
  // =========================================================

  @Get(':id')
  @Roles(
    Role.ADMIN,
    Role.ACHETEUR,
    Role.VENDEUR,
  )
  @ApiOperation({
    summary: 'Récupérer une adresse',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID de l’adresse.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Adresse récupérée avec succès.',
  })
  @ApiResponse({
    status: 404,
    description: 'Adresse introuvable.',
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non authentifié.',
  })
  findById(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.addressService.findById(id);
  }

  // =========================================================
  // FIND BY CLIENT
  // GET /addresses/client/:clientId
  // =========================================================

  @Get('client/:clientId')
  @Roles(
    Role.ADMIN,
    Role.ACHETEUR,
    Role.VENDEUR,
  )
  @ApiOperation({
    summary:
      'Lister les adresses d’un client',
  })
  @ApiParam({
    name: 'clientId',
    example: 1,
    description: 'ID du client.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Adresses du client récupérées avec succès.',
  })
  @ApiResponse({
    status: 404,
    description: 'Client introuvable.',
  })
  findByClient(
    @Param('clientId', ParseIntPipe)
    clientId: number,
  ) {
    return this.addressService.findByClient(
      clientId,
    );
  }

  // =========================================================
  // FIND BY SUPPLIER
  // GET /addresses/supplier/:supplierId
  // =========================================================

  @Get('supplier/:supplierId')
  @Roles(
    Role.ADMIN,
    Role.ACHETEUR,
    Role.VENDEUR,
  )
  @ApiOperation({
    summary:
      'Lister les adresses d’un fournisseur',
  })
  @ApiParam({
    name: 'supplierId',
    example: 1,
    description: 'ID du fournisseur.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Adresses du fournisseur récupérées avec succès.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Fournisseur introuvable.',
  })
  findBySupplier(
    @Param('supplierId', ParseIntPipe)
    supplierId: number,
  ) {
    return this.addressService.findBySupplier(
      supplierId,
    );
  }

  // =========================================================
  // UPDATE
  // PATCH /addresses/:id
  // =========================================================

  @Patch(':id')
  @Roles(
    Role.ADMIN,
    Role.ACHETEUR,
    Role.VENDEUR,
  )
  @ApiOperation({
    summary: 'Modifier une adresse',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID de l’adresse.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Adresse modifiée avec succès.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Données invalides.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Adresse introuvable.',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressService.update(
      id,
      updateAddressDto,
    );
  }

  // =========================================================
  // DELETE
  // DELETE /addresses/:id
  // =========================================================

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Supprimer une adresse',
    description:
      'Supprime définitivement une adresse. Cette opération est réservée aux administrateurs.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID de l’adresse.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Adresse supprimée avec succès.',
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
      'Adresse introuvable.',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.addressService.remove(id);
  }
}

