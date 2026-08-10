
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

import {
  ROLES_KEY,
} from '../decorators/roles.decorator';


// =========================================================
// Type de l'utilisateur contenu dans req.user
// =========================================================

interface AuthenticatedUser {
  id: number;
  email: string;
  role: Role;
}


// =========================================================
// ROLES GUARD
// =========================================================

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    // -------------------------------------------------------
    // 1. Récupérer les rôles demandés par @Roles(...)
    // -------------------------------------------------------

    const requiredRoles =
      this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    // -------------------------------------------------------
    // 2. Aucun rôle requis
    // -------------------------------------------------------

    if (!requiredRoles) {
      return true;
    }

    // -------------------------------------------------------
    // 3. Récupérer la requête HTTP
    // -------------------------------------------------------

    const request =
      context.switchToHttp().getRequest<{
        user?: AuthenticatedUser;
      }>();

    // -------------------------------------------------------
    // 4. Récupérer l'utilisateur
    // -------------------------------------------------------

    const user = request.user;

    // -------------------------------------------------------
    // 5. Vérifier l'authentification
    // -------------------------------------------------------

    if (!user) {
      console.log('Utilisateur non authentifié.');
      throw new UnauthorizedException(
        'Utilisateur non authentifié.',
      );
    }

    // -------------------------------------------------------
    // 6. Vérifier le rôle
    // -------------------------------------------------------

    const hasRole = requiredRoles.includes(
      user.role,
    );

    // -------------------------------------------------------
    // 7. Refuser l'accès
    // -------------------------------------------------------

    if (!hasRole) {
      throw new ForbiddenException(
        'Vous n’avez pas les permissions nécessaires.',
      );
    }

    // -------------------------------------------------------
    // 8. Autoriser
    // -------------------------------------------------------

    return true;
  }
}

