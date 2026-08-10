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

import { SupplierService } from './supplier.service'; 

import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Suppliers')
@ApiBearerAuth('access-token')
@Controller('suppliers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupplierController {
  constructor(
    private readonly suppliersService: SupplierService,
  ) {}

  // =========================================================
  // CREATE
  // POST /suppliers
  // =========================================================

  @Post()
  @Roles(Role.ADMIN, Role.VENDEUR)
  @ApiOperation({
    summary: 'Créer un fournisseur',
    description:
      'Crée un nouveau fournisseur.',
  })
  @ApiResponse({
    status: 201,
    description:
      'Fournisseur créé avec succès.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Données invalides ou utilisateur déjà lié à un fournisseur.',
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
      'Utilisateur associé introuvable.',
  })
  create(
    @Body() createSupplierDto: CreateSupplierDto,
  ) {
    return this.suppliersService.create(
      createSupplierDto,
    );
  }

  // =========================================================
  // LIST
  // GET /suppliers
  // =========================================================

  @Get()
  @Roles(Role.ADMIN, Role.VENDEUR)
  @ApiOperation({
    summary: 'Lister les fournisseurs',
    description:
      'Retourne la liste de tous les fournisseurs.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Liste des fournisseurs récupérée avec succès.',
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
  findAll() {
    return this.suppliersService.findAll();
  }

  // =========================================================
  // FIND ONE
  // GET /suppliers/:id
  // =========================================================

  @Get(':id')
  @Roles(Role.ADMIN, Role.VENDEUR)
  @ApiOperation({
    summary: 'Récupérer un fournisseur',
    description:
      'Retourne les informations détaillées d’un fournisseur.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description:
      'Identifiant du fournisseur.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Fournisseur récupéré avec succès.',
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
      'Fournisseur introuvable.',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.suppliersService.findOne(id);
  }

  // =========================================================
  // FIND BY USER
  // GET /suppliers/user/:userId
  // =========================================================

  @Get('user/:userId')
  @Roles(Role.ADMIN, Role.VENDEUR)
  @ApiOperation({
    summary:
      'Récupérer le fournisseur associé à un utilisateur',
    description:
      'Retourne le fournisseur lié à un utilisateur donné.',
  })
  @ApiParam({
    name: 'userId',
    example: 5,
    description:
      'Identifiant de l’utilisateur.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Fournisseur récupéré avec succès.',
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
      'Fournisseur associé introuvable.',
  })
  findByUserId(
    @Param(
      'userId',
      ParseIntPipe,
    )
    userId: number,
  ) {
    return this.suppliersService.findByUserId(
      userId,
    );
  }

  // =========================================================
  // UPDATE
  // PATCH /suppliers/:id
  // =========================================================

  @Patch(':id')
  @Roles(Role.ADMIN, Role.VENDEUR)
  @ApiOperation({
    summary: 'Modifier un fournisseur',
    description:
      'Modifie les informations d’un fournisseur existant.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description:
      'Identifiant du fournisseur.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Fournisseur modifié avec succès.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Données invalides ou utilisateur déjà associé.',
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
      'Fournisseur ou utilisateur introuvable.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.suppliersService.update(
      id,
      updateSupplierDto,
    );
  }

  // =========================================================
  // DELETE
  // DELETE /suppliers/:id
  // =========================================================

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Supprimer un fournisseur',
    description:
      'Supprime définitivement un fournisseur.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description:
      'Identifiant du fournisseur.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Fournisseur supprimé avec succès.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Utilisateur non authentifié.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Accès réservé aux administrateurs.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Fournisseur introuvable.',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.suppliersService.remove(id);
  }
}
