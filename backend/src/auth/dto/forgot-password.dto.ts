import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'jean@example.com',
    description:
      'Adresse email associée au compte utilisateur.',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}