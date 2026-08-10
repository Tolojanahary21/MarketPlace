import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UsersQueryDto {
  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Numéro de la page.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 20,
    default: 20,
    description: 'Nombre d’utilisateurs par page.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    example: 'jean',
    description:
      'Recherche par nom, prénom ou email.',
  })
  @IsOptional()
  @IsString()
  search?: string;
}