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


import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ClientService } from './client.service';

@ApiTags('Clients')
@ApiBearerAuth('access-token')
@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientController {
  constructor(
    private readonly clientsService: ClientService,
  ) {}

  // =========================================================
  // CREATE
  // POST /clients
  // =========================================================

  @Post()
  @Roles(Role.ADMIN, Role.ACHETEUR)
  @ApiOperation({
    summary: 'Créer un client',
    description:
      'Crée un nouveau client dans le système.',
  })
  @ApiResponse({
    status: 201,
    description: 'Client créé avec succès.',
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
      'Accès réservé aux administrateurs et acheteurs.',
  })
  create(
    @Body() createClientDto: CreateClientDto,
  ) {
    return this.clientsService.create(
      createClientDto,
    );
  }

  // =========================================================
  // LIST
  // GET /clients
  // =========================================================

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Lister les clients',
    description:
      'Retourne la liste des clients.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Liste des clients récupérée avec succès.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Utilisateur non authentifié.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Accès réservé aux administrateurs et acheteurs.',
  })
  findAll() {
    return this.clientsService.findAll();
  }

  // =========================================================
  // DETAIL
  // GET /clients/:id
  // =========================================================

  @Get(':id')
  @Roles(Role.ADMIN, Role.ACHETEUR)
  @ApiOperation({
    summary: 'Récupérer un client',
    description:
      'Retourne les informations détaillées d’un client.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Identifiant du client.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Client récupéré avec succès.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Utilisateur non authentifié.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Accès réservé aux administrateurs et acheteurs.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Client introuvable.',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.clientsService.findById(id);
  }

  // =========================================================
  // UPDATE
  // PATCH /clients/:id
  // =========================================================

  @Patch(':id')
  @Roles(Role.ADMIN, Role.ACHETEUR)
  @ApiOperation({
    summary: 'Modifier un client',
    description:
      'Modifie les informations d’un client existant.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Identifiant du client.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Client modifié avec succès.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Données invalides.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Utilisateur non authentifié.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Accès réservé aux administrateurs et acheteurs.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Client introuvable.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(
      id,
      updateClientDto,
    );
  }

  // =========================================================
  // DELETE
  // DELETE /clients/:id
  // =========================================================

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Supprimer un client',
    description:
      'Supprime définitivement un client.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Identifiant du client.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Client supprimé avec succès.',
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
      'Client introuvable.',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.clientsService.remove(id);
  }
  // =========================================================
    // FIND BY USER
    // GET /suppliers/user/:userId
    // =========================================================
  
    @Get('user/:userId')
    @Roles(Role.ADMIN, Role.ACHETEUR)
    @ApiOperation({
      summary:
        'Récupérer le client associé à un utilisateur',
      description:
        'Retourne le client lié à un utilisateur donné.',
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
      return this.clientsService.findByUserId(
        userId,
      );
    }
}