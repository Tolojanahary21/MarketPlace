import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'Rakoto',
    description: 'Nouveau nom.',
  })
  @IsOptional()
  @IsString()
  nom?: string;

  @ApiPropertyOptional({
    example: 'Jean',
    description: 'Nouveau prénom.',
  })
  @IsOptional()
  @IsString()
  prenom?: string;

  @ApiPropertyOptional({
    example: 'jean.rakoto@example.com',
    description: 'Nouvelle adresse email.',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: '+261341234567',
    description: 'Nouveau numéro de téléphone.',
  })
  @IsOptional()
  @IsString()
  telephone?: string;
}