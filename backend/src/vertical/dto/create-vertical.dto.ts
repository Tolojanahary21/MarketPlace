import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { VerticalStatut } from '@prisma/client';

export class CreateVerticalDto {
  @ApiProperty({
    example: 'Informatique',
    description: 'Nom du vertical.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nom!: string;

  @ApiPropertyOptional({
    example:
      'Produits et services liés au domaine informatique.',
    description: 'Description du vertical.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: VerticalStatut,
    example: VerticalStatut.ACTIF,
    description: 'Statut du vertical.',
    default: VerticalStatut.ACTIF,
  })
  @IsOptional()
  @IsEnum(VerticalStatut)
  statut?: VerticalStatut;
}



