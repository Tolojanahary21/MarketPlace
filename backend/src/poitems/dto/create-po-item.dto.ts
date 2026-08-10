import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  FulfillmentStatus,
  POItemStatut,
} from '@prisma/client';

export class CreatePOItemDto {
  // =======================================================
  // PURCHASE ORDER
  // =======================================================

  @ApiProperty({
    example: 1,
    description:
      'Identifiant du bon de commande.',
  })
  @IsInt()
  @IsNotEmpty()
  purchaseOrderId!: number;

  // =======================================================
  // PRODUCT
  // =======================================================

  @ApiProperty({
    example: 1,
    description:
      'Identifiant du produit.',
  })
  @IsInt()
  @IsNotEmpty()
  productId!: number;

  // =======================================================
  // QUANTITY
  // =======================================================

  @ApiProperty({
    example: 10,
    description:
      'Quantité commandée.',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity!: number;

  // =======================================================
  // PRICE
  // =======================================================

  @ApiProperty({
    example: 125000.50,
    description:
      'Prix unitaire du produit.',
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price!: number;

  // =======================================================
  // STATUT
  // =======================================================

  @ApiPropertyOptional({
    enum: POItemStatut,
    example: POItemStatut.EN_ATTENTE,
    description:
      'Statut de la ligne de commande.',
  })
  @IsOptional()
  @IsEnum(POItemStatut)
  statut?: POItemStatut;

  // =======================================================
  // LEAD TIME
  // =======================================================

  @ApiPropertyOptional({
    example: 15,
    description:
      'Délai de livraison en jours.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  leadTime?: number;

  // =======================================================
  // FULFILLMENT STATUS
  // =======================================================

  @ApiPropertyOptional({
    enum: FulfillmentStatus,
    example:
      FulfillmentStatus.EN_ATTENTE,
    description:
      'État de préparation et de livraison du produit.',
  })
  @IsOptional()
  @IsEnum(FulfillmentStatus)
  fulfillmentStatus?: FulfillmentStatus;

  // =======================================================
  // NOTES
  // =======================================================

  @ApiPropertyOptional({
    example:
      'Vérifier l’emballage avant expédition.',
    description:
      'Notes concernant cette ligne de commande.',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  // =======================================================
  // ALERTS - JSON
  // =======================================================

  @ApiPropertyOptional({
    example: {
      urgent: true,
      message:
        'Produit à expédier rapidement.',
    },
    description:
      'Informations d’alerte au format JSON.',
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  alerts?: Record<string, any>;
}