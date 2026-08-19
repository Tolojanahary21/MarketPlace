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

import { ProductService } from './produit.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Products')
@Controller('products')
@ApiBearerAuth('access-token')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
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
    summary: 'Créer un produit',
  })
  @ApiResponse({
    status: 201,
    description:
      'Produit créé avec succès.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Données invalides.',
  })
  create(
    @Body()
    dto: CreateProductDto,
  ) {
    return this.productService.create(
      dto,
    );
  }

  // =========================================================
  // FIND ALL
  // =========================================================

  @Get()
  // Route publique : accessible sans authentification (catalogue visiteur).
  @ApiOperation({
    summary:
      'Liste des produits',
  })
  findAll() {
    return this.productService.findAll();
  }

  // =========================================================
  // FIND ONE
  // =========================================================

  @Get(':id')
  // Route publique : accessible sans authentification (fiche produit visiteur).
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiOperation({
    summary:
      'Détail d’un produit',
  })
  @ApiResponse({
    status: 404,
    description:
      'Produit introuvable.',
  })
  findOne(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.productService.findById(
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
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiOperation({
    summary:
      'Modifier un produit',
  })
  update(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Body()
    dto: UpdateProductDto,
  ) {
    return this.productService.update(
      id,
      dto,
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
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiOperation({
    summary:
      'Supprimer un produit',
  })
  remove(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.productService.remove(
      id,
    );
  }
}