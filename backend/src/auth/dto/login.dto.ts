import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  // Email de l'utilisateur
  @IsEmail()
  email: string;
  // Mot de passe
  @IsNotEmpty()
  password: string;
}
