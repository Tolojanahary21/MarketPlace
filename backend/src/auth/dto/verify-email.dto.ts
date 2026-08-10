import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({
    example: 'jean@example.com',
    description: 'Adresse email de l’utilisateur',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '123456',
    description: 'OTP de vérification',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  otp!: string;
}