import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsPositive,
  Min,
} from 'class-validator';

import {
  ProductStatut,
  UOM,
} from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({
    example: 'Ordinateur portable HP',
    description: 'Nom du produit.',
  })
  @IsString()
  nom!: string;

  @ApiPropertyOptional({
    example: 'Ordinateur portable professionnel.',
    description: 'Description du produit.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'Intel Core i5, 16GB RAM, SSD 512GB',
    description: 'Spécifications techniques du produit.',
  })
  @IsOptional()
  @IsString()
  specifications?: string;

  @ApiPropertyOptional({
    enum: ProductStatut,
    example: ProductStatut.ACTIF,
    default: ProductStatut.ACTIF,
  })
  @IsOptional()
  @IsEnum(ProductStatut)
  statut?: ProductStatut;

  @ApiProperty({
    example: 1,
    description: 'ID du fournisseur.',
  })
  @IsInt()
  @IsPositive()
  supplierId!: number;

  @ApiProperty({
    example: 1,
    description: 'ID de la catégorie.',
  })
  @IsInt()
  @IsPositive()
  categoryId!: number;

  @ApiProperty({
    enum: UOM,
    example: UOM.PIECE,
    description: 'Unité de mesure du produit.',
  })
  @IsEnum(UOM)
  uom!: UOM;

  @ApiPropertyOptional({
    example: 10,
    description: 'Quantité minimale de commande.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  moq?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Quantité minimale.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  quantityMinimum?: number;

  @ApiPropertyOptional({
    example: 5,
    description: 'Multiple de quantité autorisé.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  quantityMultiples?: number;

  @ApiPropertyOptional({
    example: 20,
    description: 'Quantité par carton/pack principal.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  quantityMasterPack?: number;

  @ApiPropertyOptional({
    example: 35.5,
    description: 'Longueur du produit.',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  dimensionLongueur?: number;

  @ApiPropertyOptional({
    example: 20.5,
    description: 'Largeur du produit.',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  dimensionLargeur?: number;

  @ApiPropertyOptional({
    example: 10.2,
    description: 'Hauteur du produit.',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  dimensionHauteur?: number;

  @ApiPropertyOptional({
    example: 2.5,
    description: 'Poids du produit.',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  dimensionPoids?: number;

  @ApiProperty({
    example: 150000,
    description: 'Prix de base du produit.',
  })
  @IsNumber()
  @IsPositive()
  basePrice!: number;

  @ApiPropertyOptional({
    example: 120000,
    description: 'Coût du produit.',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @ApiPropertyOptional({
    example: 180000,
    description: 'Prix de vente conseillé.',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  msrp?: number;

  @ApiPropertyOptional({
    example: 14,
    description: 'Délai de livraison en jours.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  leadTime?: number;
}