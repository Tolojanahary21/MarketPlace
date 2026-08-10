import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Rakoto',
    description: 'Nom de famille de l’utilisateur.',
  })
  @IsString()
  @IsNotEmpty()
  nom!: string;

  @ApiProperty({
    example: 'Jean',
    description: 'Prénom de l’utilisateur.',
  })
  @IsString()
  @IsNotEmpty()
  prenom!: string;

  @ApiProperty({
    example: 'jean.rakoto@example.com',
    description: 'Adresse email unique.',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Mot de passe de l’utilisateur.',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password!: string;

  @ApiPropertyOptional({
    example: '+261341234567',
    description: 'Numéro de téléphone.',
  })
  @IsOptional()
  @IsString()
  telephone?: string;
}