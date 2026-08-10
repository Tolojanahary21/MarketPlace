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
  Req,
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

import { UsersService } from './users.service';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdateUserRoleDto } from '../dto/update-user-role.dto';
import { UpdateUserStatusDto } from '../dto/update-user-status.dto';
import { UsersQueryDto } from '../dto/users-query.dto';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import type { Request } from 'express';


// =========================================================
// USERS CONTROLLER
// =========================================================

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  // =======================================================
  // REGISTER
  // POST /users/register
  // =======================================================

  /**
   * Inscription publique.
   *
   * Un utilisateur créé ici devient automatiquement :
   *
   * role   = ACHETEUR
   * statut = ACTIF
   */
  @Post('register')
  @ApiOperation({
    summary: 'Créer un nouvel utilisateur',
    description:
      'Permet à un nouvel utilisateur de créer un compte. Le rôle ACHETEUR est attribué automatiquement.',
  })
  @ApiResponse({
    status: 201,
    description:
      'Utilisateur créé avec succès.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Données invalides ou adresse email déjà utilisée.',
  })
  register(
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.register(
      createUserDto,
    );
  }

  // =======================================================
  // LIST
  // GET /users
  // =======================================================

  /**
   * Liste des utilisateurs.
   *
   * Accessible uniquement aux ADMIN.
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Lister les utilisateurs',
    description:
      'Retourne la liste paginée des utilisateurs. Accessible uniquement aux administrateurs.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Liste des utilisateurs retournée avec succès.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Token JWT absent ou invalide.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Accès réservé aux administrateurs.',
  })
  findAll(
    @Query() query: UsersQueryDto,
  ) {
    return this.usersService.findAll(
      query.page,
      query.limit,
    );
  }

  // =======================================================
  // DETAIL
  // GET /users/:id
  // =======================================================

  /**
   * Récupérer un utilisateur.
   *
   * Accessible uniquement aux ADMIN.
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Récupérer un utilisateur',
    description:
      'Retourne les informations publiques d’un utilisateur.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description:
      'Identifiant de l’utilisateur.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Utilisateur trouvé.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Token JWT absent ou invalide.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Accès réservé aux administrateurs.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Utilisateur introuvable.',
  })
  findOne(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.usersService.findById(
      id,
    );
  }

  // =======================================================
  // UPDATE INFORMATION
  // PATCH /users/:id
  // =======================================================

  /**
   * Modifier les informations d'un utilisateur.
   *
   * Accessible uniquement aux ADMIN.
   *
   * Le role, statut et password ne sont pas
   * modifiés par cette route.
   */
  @Patch('update/info')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ACHETEUR, Role.VENDEUR)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'Modifier les informations utilisateur',
    description:
      'Modifie le nom, prénom, email ou téléphone d’un utilisateur.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Utilisateur modifié avec succès.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Email déjà utilisé ou données invalides.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Utilisateur introuvable.',
  })
  update(
    @Req() req:Request,
    @Body()
    updateUserDto: UpdateUserDto,
  ) {
    try {
      const user = req.user as { id: number };
      const id = user.id;
    return this.usersService.update(
      id,
      updateUserDto,
    );
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l’utilisateur :', error);
    }
  }

  // =======================================================
  // UPDATE STATUS
  // PATCH /users/:id/status
  // =======================================================

  /**
   * Modifier le statut d'un utilisateur.
   *
   * Accessible uniquement aux ADMIN.
   */
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'Modifier le statut utilisateur',
    description:
      'Active ou désactive le compte d’un utilisateur.',
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
    status: 403,
    description:
      'Accès réservé aux administrateurs.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Utilisateur introuvable.',
  })
  updateStatus(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Body()
    dto: UpdateUserStatusDto,
  ) {
    return this.usersService.updateStatus(
      id,
      dto,
    );
  }

  // =======================================================
  // UPDATE ROLE
  // PATCH /users/:id/role
  // =======================================================

  /**
   * Modifier le rôle d'un utilisateur.
   *
   * Accessible uniquement aux ADMIN.
   */
  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'Modifier le rôle utilisateur',
    description:
      'Permet à un administrateur de modifier le rôle d’un utilisateur.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description:
      'Rôle modifié avec succès.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Accès réservé aux administrateurs.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Utilisateur introuvable.',
  })
  updateRole(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Body()
    dto: UpdateUserRoleDto,
  ) {
    return this.usersService.updateRole(
      id,
      dto,
    );
  }

  // =======================================================
  // DELETE
  // DELETE /users/:id
  // =======================================================

  /**
   * Supprimer définitivement un utilisateur.
   *
   * Accessible uniquement aux ADMIN.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'Supprimer un utilisateur',
    description:
      'Supprime définitivement un utilisateur de la base de données.',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description:
      'Utilisateur supprimé avec succès.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Accès réservé aux administrateurs.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Utilisateur introuvable.',
  })
  remove(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.usersService.remove(
      id,
    );
  }
}

