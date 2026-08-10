import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'email@example.com',
    description:
      'Adresse email de l’utilisateur.',
  })
  @IsString()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'NouveauPassword123!',
    description:
      'Nouveau mot de passe de l’utilisateur.',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword!: string;

  @ApiProperty({
  example: '483921',
  description:
    'Code OTP à 6 chiffres reçu par email.',
  minLength: 6,
  maxLength: 6,
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{6}$/, {
    message:
        'Le code OTP doit contenir exactement 6 chiffres.',
    })
    otp!: string;
}