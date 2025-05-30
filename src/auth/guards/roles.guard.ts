import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

// Guards
import { ROLES_KEY } from '../decorators/roles.decorator'; // Importa la clave del decorador

// Enums
import { UserRole } from '../../common/enums/user.role'; // Tu enum de roles

// Models
import { User } from '../../users/entities/user.model'; // Importa el modelo User para el tipo de req.user

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [ context.getHandler(),  context.getClass() ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !(user instanceof User) || !user.roles || user.roles.length === 0) {
        throw new ForbiddenException('You do not have the necessary roles to access this resource.');
    }

    const userRoles = user.roles.map(role => role.rol);

    const hasRequiredRole = requiredRoles.some(requiredRole => userRoles.includes(requiredRole));

    if (!hasRequiredRole) {
      throw new ForbiddenException('You do not have the necessary roles to access this resource.');
    }

    return true;
  }
}