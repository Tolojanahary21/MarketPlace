import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { QuoteStatut } from '@prisma/client';

export class CreateQuoteDto {
  @ApiProperty({
    example: 'Devis fournitures informatiques',
    description: 'Nom du devis.',
  })
  @IsString()
  @IsNotEmpty()
  nom!: string;

  @ApiPropertyOptional({
    enum: QuoteStatut,
    example: QuoteStatut.BROUILLON,
    description: 'Statut du devis.',
  })
  @IsOptional()
  @IsEnum(QuoteStatut)
  statut?: QuoteStatut;

  @ApiProperty({
    example: 1,
    description: 'ID du client associé au devis.',
  })
  @IsInt()
  @Min(1)
  clientId!: number;

  @ApiProperty({
    example: 1,
    description: 'ID du fournisseur associé au devis.',
  })
  @IsInt()
  @Min(1)
  supplierId!: number;

  @ApiPropertyOptional({
    example: [
      {
        productId: 1,
        quantity: 10,
        unitPrice: 25000,
        total: 250000,
      },
    ],
    description: 'Liste des articles du devis.',
    type: 'array',
  })
  @IsOptional()
  items?: Record<string, any>[];

  @ApiPropertyOptional({
    example: 'Livraison prévue sous 7 jours.',
    description: 'Notes ou informations complémentaires.',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    example: 1250000.5,
    description: 'Montant total du devis.',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  total?: number;

  @ApiPropertyOptional({
    example: 7,
    description: 'Délai de livraison en jours.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  leadTime?: number;
}


