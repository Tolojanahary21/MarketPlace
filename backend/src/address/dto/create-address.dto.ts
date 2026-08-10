import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiPropertyOptional({
    example: 'Adresse principale',
    description: 'Nom ou libellé de l’adresse.',
  })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({
    example: 'À l’attention de Jean Rakoto',
  })
  @IsOptional()
  @IsString()
  attention?: string;

  @ApiProperty({
    example: 'Lot II A 25',
    description: 'Adresse principale.',
  })
  @IsString()
  @IsNotEmpty()
  line1!: string;

  @ApiPropertyOptional({
    example: 'Bâtiment B',
  })
  @IsOptional()
  @IsString()
  line2?: string;

  @ApiPropertyOptional({
    example: '2ème étage',
  })
  @IsOptional()
  @IsString()
  line3?: string;

  @ApiProperty({
    example: 'Antananarivo',
  })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiPropertyOptional({
    example: 'Analamanga',
  })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({
    example: '101',
  })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({
    example: 'Madagascar',
  })
  @IsString()
  @IsNotEmpty()
  country!: string;

  @ApiPropertyOptional({
    example: '+261341234567',
  })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiPropertyOptional({
    example: 'Jean Rakoto',
  })
  @IsOptional()
  @IsString()
  contactName?: string;

  @ApiPropertyOptional({
    example: '+261341234567',
  })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({
    example: 'jean.rakoto@example.com',
  })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID du client auquel l’adresse est associée.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  clientId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID du fournisseur auquel l’adresse est associée.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  supplierId?: number;
}



