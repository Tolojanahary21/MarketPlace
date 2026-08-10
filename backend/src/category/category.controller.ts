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

import { CategoryService } from './category.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateCategoryStatusDto } from './dto/update-category-status.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Categories')
@ApiBearerAuth('access-token')
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
  ) {}

  // =========================================================
  // CREATE
  // POST /categories
  // ADMIN
  // =========================================================

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Créer une catégorie',
    description:
      'Crée une nouvelle catégorie associée à une vertical.',
  })
  @ApiResponse({
    status: 201,
    description:
      'Catégorie créée avec succès.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Vertical introuvable ou catégorie déjà existante.',
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
  create(
    @Body()
    createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(
      createCategoryDto,
    );
  }

  // =========================================================
  // FIND ALL
  // GET /categories
  // ADMIN + VENDEUR
  // =========================================================

  @Get()
  @Roles(
    Role.ADMIN,
    Role.VENDEUR,
  )
  @ApiOperation({
    summary: 'Lister les catégories',
    description:
      'Retourne la liste paginée des catégories.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Liste des catégories retournée avec succès.',
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
    return this.categoryService.findAll();
  }

  // =========================================================
  // FIND ONE
  // GET /categories/:id
  // ADMIN + VENDEUR
  // =========================================================

  @Get(':id')
  @Roles(
    Role.ADMIN,
    Role.VENDEUR,
  )
  @ApiOperation({
    summary: 'Récupérer une catégorie',
    description:
      'Retourne les informations détaillées d’une catégorie.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description:
      'Identifiant de la catégorie.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Catégorie trouvée.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Catégorie introuvable.',
  })
  findById(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.categoryService.findById(
      id,
    );
  }

  // =========================================================
  // FIND BY VERTICAL
  // GET /categories/vertical/:verticalId
  // ADMIN + VENDEUR
  // =========================================================

  @Get('vertical/:verticalId')
  @Roles(
    Role.ADMIN,
    Role.VENDEUR,
  )
  @ApiOperation({
    summary:
      'Lister les catégories d’une vertical',
    description:
      'Retourne toutes les catégories appartenant à une vertical.',
  })
  @ApiParam({
    name: 'verticalId',
    example: 1,
    description:
      'Identifiant de la vertical.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Catégories retournées avec succès.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Vertical introuvable.',
  })
  findByVertical(
    @Param(
      'verticalId',
      ParseIntPipe,
    )
    verticalId: number,
  ) {
    return this.categoryService.findByVertical(
      verticalId,
    );
  }

  // =========================================================
  // UPDATE
  // PATCH /categories/:id
  // ADMIN
  // =========================================================

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Modifier une catégorie',
    description:
      'Modifie le nom, la description ou la vertical d’une catégorie.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description:
      'Identifiant de la catégorie.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Catégorie modifiée avec succès.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Données invalides ou catégorie déjà existante.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Catégorie introuvable.',
  })
  update(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Body()
    updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(
      id,
      updateCategoryDto,
    );
  }

  // =========================================================
  // UPDATE STATUS
  // PATCH /categories/:id/status
  // ADMIN
  // =========================================================

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary:
      'Modifier le statut d’une catégorie',
    description:
      'Active ou désactive une catégorie.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description:
      'Identifiant de la catégorie.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Statut modifié avec succès.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Catégorie introuvable.',
  })
  updateStatus(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Body()
    dto: UpdateCategoryStatusDto,
  ) {
    return this.categoryService.updateStatus(
      id,
      dto.statut,
    );
  }

  // =========================================================
  // DELETE
  // DELETE /categories/:id
  // ADMIN
  // =========================================================

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Supprimer une catégorie',
    description:
      'Supprime définitivement une catégorie.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description:
      'Identifiant de la catégorie.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Catégorie supprimée avec succès.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Impossible de supprimer la catégorie.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Catégorie introuvable.',
  })
  remove(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.categoryService.remove(
      id,
    );
  }
}