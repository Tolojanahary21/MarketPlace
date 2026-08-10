import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendOtpDto } from './dto/resendOtp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  // =========================================================
  // LOGIN
  // POST /auth/login
  // =========================================================

  @Post('login')
  @ApiOperation({
    summary: 'Connecter un utilisateur',
    description:
      'Authentifie un utilisateur avec son email et son mot de passe et retourne un access token JWT.',
  })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie.',
    schema: {
      example: {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          nom: 'Rakoto',
          prenom: 'Jean',
          email: 'jean.rakoto@example.com',
          role: 'VENDEUR',
          statut: 'ACTIF',
          telephone: '+261341234567',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Données de connexion invalides.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Email ou mot de passe incorrect.',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(
      loginDto.email,
      loginDto.password,
    );
  }

  // =========================================================
  // ME
  // GET /auth/me
  // =========================================================

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Récupérer mon profil',
    description:
      'Retourne les informations de l’utilisateur actuellement connecté.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Profil de l’utilisateur connecté.',
    schema: {
      example: {
        id: 1,
        nom: 'Rakoto',
        prenom: 'Jean',
        email: 'jean@example.com',
        role: 'VENDEUR',
        statut: 'ACTIF',
        telephone: '+261341234567',
        createdAt: '2026-08-10T08:00:00.000Z',
        updatedAt: '2026-08-10T08:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description:
      'Token absent, invalide ou expiré.',
  })
  me(@Req() req: Request) {
    const user = req.user as {
      id: number;
    };

    return this.authService.me(user.id);
  }

  // =========================================================
  // CHANGE PASSWORD
  // POST /auth/change-password
  // =========================================================

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Changer mon mot de passe',
    description:
      'Permet à un utilisateur connecté de modifier son mot de passe en fournissant son ancien mot de passe.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Mot de passe modifié avec succès.',
    schema: {
      example: {
        message:
          'Mot de passe modifié avec succès.',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Ancien mot de passe incorrect ou nouveau mot de passe invalide.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Utilisateur non authentifié.',
  })
  changePassword(
    @Req() req: Request,
    @Body() dto: ChangePasswordDto,
  ) {
    const user = req.user as {
      id: number;
    };

    return this.authService.changePassword(
      user.id,
      dto.currentPassword,
      dto.newPassword,
    );
  }

  // =========================================================
  // FORGOT PASSWORD
  // POST /auth/forgot-password
  // =========================================================

  @Post('forgot-password')
  @ApiOperation({
    summary:
      'Demander la réinitialisation du mot de passe',
    description:
      'Envoie une demande de réinitialisation du mot de passe à partir de l’adresse email.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Demande traitée avec succès.',
    schema: {
      example: {
        message:
          'Si cette adresse email existe, un lien de réinitialisation sera envoyé.',
      },
    },
  })
  forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ) {
    return this.authService.forgotPassword(
      dto.email,
    );
  }

  // =========================================================
  // RESET PASSWORD
  // POST /auth/reset-password
  // =========================================================

  @Post('reset-password') 
  @ApiOperation({ summary: 'Réinitialiser le mot de passe', description: 'Réinitialise le mot de passe avec l’adresse email, le code OTP reçu par email et le nouveau mot de passe.', }) 
  @ApiResponse({ status: 200, description: 'Mot de passe réinitialisé avec succès.', schema: { example: { message: 'Mot de passe réinitialisé avec succès.', }, }, }) 
  @ApiResponse({ status: 400, description: 'OTP invalide, expiré ou données invalides.', }) 
  @ApiResponse({ status: 404, description: 'Utilisateur introuvable.', }) 
  resetPassword( @Body() dto: ResetPasswordDto, ) 
  { return this.authService.resetPassword( dto.email, dto.otp, dto.newPassword, ); }

  // =========================================================
// VERIFY EMAIL
// POST /auth/verify-email
// =========================================================
@Post('verify-email')
@ApiOperation({
  summary: 'Vérifier l’adresse email',
  description:
    'Vérifie l’adresse email avec le code OTP reçu par email.',
})
@ApiResponse({
  status: 200,
  description:
    'Adresse email vérifiée avec succès.',
  schema: {
    example: {  
    message:
        'Adresse email vérifiée avec succès.',
    },
  },
})
@ApiResponse({    
status: 400,  
  description:    
'OTP invalide, expiré ou données invalides.', 
})
@ApiResponse({    
status: 404,
  description:    
'Utilisateur introuvable.', 
})
verifyEmail(
  @Body() dto: VerifyEmailDto,
) { 
  return this.authService.verifyEmail(
    dto.email,
    dto.otp,
  ); 
}

// =========================================================
// RESEND OTP
// POST /auth/resend-otp
// =========================================================
@Post('resend-otp')
@ApiOperation({
  summary: 'Renvoyer le code OTP',
  description: 
    'Renvoyer le code OTP pour la vérification de l’adresse email ou la réinitialisation du mot de passe.',
})
@ApiResponse({
  status: 200,
  description: 'Code OTP renvoyé avec succès.',
})
resendOtp(
  @Body() dto: ResendOtpDto,
) {
  return this.authService.resendVerificationOtp(
    dto.email,
  );
}
// =========================================================
  // REFRESH TOKEN
  // =========================================================

  /**
   * POST /auth/refresh
   *
   * Génère un nouvel access token et un nouveau
   * refresh token à partir d'un refresh token valide.
   */
  @Post('refresh')
  @ApiOperation({
    summary: 'Rafraîchir le token JWT',
    description:
      'Permet de générer un nouvel access token et un nouveau refresh token lorsque le token d’accès a expiré.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Tokens renouvelés avec succès.',
    schema: {
      example: {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          nom: 'Rakoto',
          prenom: 'Jean',
          email: 'jean.rakoto@example.com',
          role: 'ACHETEUR',
          statut: 'ACTIF',
          telephone: '+261341234567',
          emailVerified: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Refresh token manquant ou données invalides.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Refresh token invalide ou expiré.',
  })
  refresh(
    @Body() dto: RefreshTokenDto,
  ) {
    return this.authService.refresh(
      dto.refresh_token,
    );
  }

}