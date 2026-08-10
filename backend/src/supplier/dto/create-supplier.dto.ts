import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

import {
  SupplierStatut,
  SupplierType,
} from '@prisma/client';

export class CreateSupplierDto {
  @ApiProperty({
    example: 'Fournisseur ABC',
    description: 'Nom d’affichage du fournisseur.',
  })
  @IsString()
  @IsNotEmpty()
  displayName!: string;

  @ApiPropertyOptional({
    example: 'ABC Distribution SARL',
    description: 'Nom de l’entreprise du fournisseur.',
  })
  @IsOptional()
  @IsString()
  entreprise?: string;

  @ApiPropertyOptional({
    example: '+261341234567',
    description: 'Deuxième numéro de téléphone.',
  })
  @IsOptional()
  @IsString()
  telephone2?: string;

  @ApiPropertyOptional({
    example: 'https://www.example.com',
    description: 'Site web du fournisseur.',
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({
    example: '2026-08-10T00:00:00.000Z',
    description: 'Date de création du fournisseur.',
  })
  @IsOptional()
  @IsDateString()
  dateCreation?: string;

  @ApiPropertyOptional({
    example: {
      mode: 'VIREMENT',
      delai: 30,
    },
    description: 'Conditions de paiement du fournisseur.',
    type: 'object',
    additionalProperties: true
  })
  @IsOptional()
  @IsObject()
  paymentTerms?: Record<string, unknown>;

  @ApiPropertyOptional({
    example: {
      banque: 'BOA',
      titulaire: 'ABC Distribution SARL',
      iban: 'MG00XXXX0000000000000000',
    },
    description: 'Informations bancaires du fournisseur.',
    type: 'object',
    additionalProperties: true
  })
  @IsOptional()
  @IsObject()
  bankInfo?: Record<string, unknown>;

  @ApiPropertyOptional({
    enum: SupplierStatut,
    example: SupplierStatut.ACTIF,
    default: SupplierStatut.ACTIF,
    description: 'Statut du fournisseur.',
  })
  @IsOptional()
  @IsEnum(SupplierStatut)
  statut?: SupplierStatut;

  @ApiProperty({
    enum: SupplierType,
    example: SupplierType.DISTRIBUTEUR,
    description: 'Type de fournisseur.',
  })
  @IsEnum(SupplierType)
  type!: SupplierType;

  @ApiPropertyOptional({
    example: 5,
    description:
      'Identifiant de l’utilisateur associé au fournisseur.',
  })
  @IsOptional()
  @IsInt()
  userId?: number;
}
