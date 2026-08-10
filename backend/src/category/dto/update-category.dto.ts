import {
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    example: 'Ordinateurs portables',
    description:
      'Nouveau nom de la catégorie.',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  nom?: string;

  @ApiPropertyOptional({
    example:
      'Ordinateurs portables pour professionnels et particuliers.',
    description:
      'Nouvelle description de la catégorie.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 2,
    description:
      'Nouvel identifiant de la vertical.',
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  verticalId?: number;
}