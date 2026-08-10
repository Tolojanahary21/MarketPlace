import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateImageDto {
  @ApiProperty({
    example: 1,
    description: 'ID du produit auquel appartient l’image.',
  })
  @IsInt()
  @Min(1)
  productId!: number;

  @ApiProperty({
    example: 'https://example.com/images/ordinateur-hp.jpg',
    description: 'URL de l’image du produit.',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url!: string;

  @ApiPropertyOptional({
    example: 'Ordinateur portable HP',
    description: 'Texte alternatif de l’image.',
  })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indique si cette image est l’image principale du produit.',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({
    example: 0,
    description: 'Position de l’image dans la liste des images du produit.',
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}