// src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../common/enums/user.role'; // Importa tu enum de roles

export const ROLES_KEY = 'roles'; // La clave que el RolesGuard buscará

// Decorador @Roles que acepta una lista de roles permitidos
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);