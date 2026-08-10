import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'jean.rakoto@example.com',
    description: 'Adresse email de l’utilisateur',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Mot de passe de l’utilisateur',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}