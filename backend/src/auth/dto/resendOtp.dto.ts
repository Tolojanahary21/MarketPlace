import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class ResendOtpDto {
  @ApiProperty({
    example: 'jean@example.com',
    description: 'Adresse email de l’utilisateur',
  })
  @IsEmail()
  email!: string;
}