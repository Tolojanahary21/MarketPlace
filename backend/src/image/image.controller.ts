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

import { ImageService } from './image.service';

import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Images')
@Controller('images')
@ApiBearerAuth('access-token')
export class ImageController {
  constructor(
    private readonly imageService: ImageService,
  ) {}

  // =========================================================
  // CREATE
  // =========================================================

  @Post()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    Role.ADMIN,
    Role.VENDEUR,
  )
  @ApiOperation({
    summary: 'Ajouter une image à un produit',
  })
  @ApiResponse({
    status: 201,
    description:
      'Image créée avec succès.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Produit introuvable.',
  })
  create(
    @Body()
    dto: CreateImageDto,
  ) {
    return this.imageService.create(
      dto,
    );
  }

  // =========================================================
  // FIND ALL
  // =========================================================

  @Get()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    Role.ADMIN,
    Role.VENDEUR,
    Role.ACHETEUR,
  )
  @ApiOperation({
    summary: 'Lister toutes les images',
  })
  @ApiResponse({
    status: 200,
    description:
      'Liste des images.',
  })
  findAll() {
    return this.imageService.findAll();
  }

  // =========================================================
  // FIND BY PRODUCT
  // =========================================================

  @Get('product/:productId')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    Role.ADMIN,
    Role.VENDEUR,
    Role.ACHETEUR,
  )
  @ApiOperation({
    summary:
      'Lister les images d’un produit',
  })
  @ApiParam({
    name: 'productId',
    example: 1,
    description:
      'ID du produit.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Images du produit.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Produit introuvable.',
  })
  findByProduct(
    @Param(
      'productId',
      ParseIntPipe,
    )
    productId: number,
  ) {
    return this.imageService.findByProduct(
      productId,
    );
  }

  // =========================================================
  // FIND ONE
  // =========================================================

  @Get(':id')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    Role.ADMIN,
    Role.VENDEUR,
    Role.ACHETEUR,
  )
  @ApiOperation({
    summary:
      'Récupérer une image',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description:
      'Image trouvée.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Image introuvable.',
  })
  findOne(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.imageService.findOne(
      id,
    );
  }

  // =========================================================
  // UPDATE
  // =========================================================

  @Patch(':id')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    Role.ADMIN,
    Role.VENDEUR,
  )
  @ApiOperation({
    summary:
      'Modifier une image',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description:
      'Image modifiée avec succès.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Image introuvable.',
  })
  update(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Body()
    dto: UpdateImageDto,
  ) {
    return this.imageService.update(
      id,
      dto,
    );
  }

  // =========================================================
  // SET PRIMARY
  // =========================================================

  @Patch(':id/primary')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    Role.ADMIN,
    Role.VENDEUR,
  )
  @ApiOperation({
    summary:
      'Définir une image comme principale',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description:
      'Image définie comme principale.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Image introuvable.',
  })
  setPrimary(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.imageService.setPrimary(
      id,
    );
  }

  // =========================================================
  // DELETE
  // =========================================================

  @Delete(':id')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary:
      'Supprimer une image',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description:
      'Image supprimée avec succès.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Image introuvable.',
  })
  remove(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.imageService.remove(
      id,
    );
  }
}