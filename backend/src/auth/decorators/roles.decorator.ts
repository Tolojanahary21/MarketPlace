//Gerer les roles

import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

// Clé utilisée pour stocker les rôles dans les métadonnées
export const ROLES_KEY = 'roles';

// Décorateur permettant de définir les rôles autorisés
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
