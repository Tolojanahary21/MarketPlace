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

import { VerticalService } from './vertical.service';

import { CreateVerticalDto } from './dto/create-vertical.dto';
import { UpdateVerticalDto } from './dto/update-vertical.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Verticals')
@ApiBearerAuth('access-token')
@Controller('verticals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VerticalController {
  constructor(
    private readonly verticalService: VerticalService,
  ) {}

  // =========================================================
  // CREATE
  // POST /verticals
  // =========================================================

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Créer une verticale',
    description:
      'Permet à un administrateur de créer une nouvelle verticale.',
  })
  @ApiResponse({
    status: 201,
    description: 'Verticale créée avec succès.',
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides.',
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non authentifié.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Accès réservé aux administrateurs.',
  })
  create(
    @Body() createVerticalDto: CreateVerticalDto,
  ) {
    return this.verticalService.create(
      createVerticalDto,
    );
  }

  // =========================================================
  // LIST
  // GET /verticals
  // =========================================================

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Lister les verticales',
    description:
      'Retourne la liste des verticales.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Liste des verticales récupérée avec succès.',
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non authentifié.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Accès réservé aux administrateurs.',
  })
  findAll() {
    return this.verticalService.findAll();
  }

  // =========================================================
  // DETAIL
  // GET /verticals/:id
  // =========================================================

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Récupérer une verticale',
    description:
      'Retourne une verticale à partir de son identifiant.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Identifiant de la verticale.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Verticale récupérée avec succès.',
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non authentifié.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Accès réservé aux administrateurs.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Verticale introuvable.',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.verticalService.findById(id);
  }

  // =========================================================
  // UPDATE
  // PATCH /verticals/:id
  // =========================================================

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Modifier une verticale',
    description:
      'Permet à un administrateur de modifier une verticale.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Identifiant de la verticale.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Verticale modifiée avec succès.',
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides.',
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non authentifié.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Accès réservé aux administrateurs.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Verticale introuvable.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVerticalDto: UpdateVerticalDto,
  ) {
    return this.verticalService.update(
      id,
      updateVerticalDto,
    );
  }

  // =========================================================
  // DELETE
  // DELETE /verticals/:id
  // =========================================================

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Supprimer une verticale',
    description:
      'Supprime définitivement une verticale.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Identifiant de la verticale.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Verticale supprimée avec succès.',
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non authentifié.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Accès réservé aux administrateurs.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Verticale introuvable.',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.verticalService.remove(id);
  }
}

