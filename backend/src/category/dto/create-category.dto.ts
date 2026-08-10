import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Ordinateurs',
    description: 'Nom de la catégorie.',
  })
  @IsString()
  @IsNotEmpty()
  nom!: string;

  @ApiPropertyOptional({
    example:
      'Ordinateurs portables et ordinateurs de bureau.',
    description:
      'Description de la catégorie.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 1,
    description:
      'Identifiant de la vertical à laquelle appartient la catégorie.',
  })
  @IsInt()
  @Min(1)
  verticalId!: number;
}