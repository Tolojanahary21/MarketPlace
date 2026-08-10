import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import {
  ClientType,
} from '@prisma/client';

export class CreateClientDto {
  @ApiProperty({
    example: 'Jean Rakoto',
    description: 'Nom affiché du client.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  displayName!: string;

  @ApiPropertyOptional({
    example: 'Rakoto SARL',
    description: 'Nom de l’entreprise du client.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  entreprise?: string;

  @ApiPropertyOptional({
    example: '+261321234567',
    description: 'Deuxième numéro de téléphone.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  telephone2?: string;

  @ApiProperty({
    enum: ClientType,
    example: 'PARTICULIER',
    description: 'Type du client.',
  })
  @IsEnum(ClientType)
  type!: ClientType;
}
