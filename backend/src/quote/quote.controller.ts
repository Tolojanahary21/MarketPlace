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

import { QuoteService } from './quote.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';

import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';



@ApiTags('Quotes')
@ApiBearerAuth('access-token')
@Controller('quotes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuoteController {
  constructor(
    private readonly quoteService: QuoteService,
  ) {}

  // ======================================================
  // CREATE
  // POST /quotes
  // ======================================================

  @Post()
  @Roles(Role.ADMIN, Role.VENDEUR)
  @ApiOperation({
    summary: 'Créer un devis',
    description:
      'Crée un nouveau devis pour un client et un fournisseur.',
  })
  @ApiResponse({
    status: 201,
    description: 'Devis créé avec succès.',
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
      'Accès réservé aux administrateurs et vendeurs.',
  })
  create(
    @Body() createQuoteDto: CreateQuoteDto,
  ) {
    return this.quoteService.create(
      createQuoteDto,
    );
  }

  // ======================================================
  // FIND ALL
  // GET /quotes
  // ======================================================

  @Get()
  @Roles(
    Role.ADMIN,
    Role.VENDEUR,
    Role.ACHETEUR,
  )
  @ApiOperation({
    summary: 'Lister les devis',
    description:
      'Retourne la liste des devis.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Liste des devis récupérée avec succès.',
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
    return this.quoteService.findAll();
  }

  // ======================================================
  // FIND ONE
  // GET /quotes/:id
  // ======================================================

  @Get(':id')
  @Roles(
    Role.ADMIN,
    Role.VENDEUR,
    Role.ACHETEUR,
  )
  @ApiOperation({
    summary: 'Récupérer un devis',
    description:
      'Retourne les détails d’un devis.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID du devis.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Devis récupéré avec succès.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Devis introuvable.',
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
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.quoteService.findOne(id);
  }

  // ======================================================
  // UPDATE
  // PATCH /quotes/:id
  // ======================================================

  @Patch(':id')
  @Roles(Role.ADMIN, Role.VENDEUR)
  @ApiOperation({
    summary: 'Modifier un devis',
    description:
      'Modifie les informations d’un devis.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID du devis.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Devis modifié avec succès.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Données invalides.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Devis introuvable.',
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
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuoteDto: UpdateQuoteDto,
  ) {
    return this.quoteService.update(
      id,
      updateQuoteDto,
    );
  }

  // ======================================================
  // DELETE
  // DELETE /quotes/:id
  // ======================================================

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Supprimer un devis',
    description:
      'Supprime définitivement un devis.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID du devis.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Devis supprimé avec succès.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Devis introuvable.',
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
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.quoteService.remove(id);
  }
}
