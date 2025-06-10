import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

// Guards
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';

// Enums
import { UserRole } from '../../common/enums/user.role';

// Models
import { User } from '../../users/entities/user.model';
import { ApiException } from '../exceptions/api.exception';
import { BadResponse } from 'src/common/responses/bad_response';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    const requiredRoles = this.reflector.get<UserRole[]>(ROLES_KEY, context.getHandler());

    if (!requiredRoles) { return true }
    if ( requiredRoles.length === 0 ) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;


    if (!user || !(user instanceof User) || !user.roles || user.roles.length === 0) {
        throw new ApiException(BadResponse.TOKEN_NOT_PROVIDED_OR_NOT_ROLE_PERMITION);
    }

    const userRoles = user.roles.map(role => role.rol);

    const hasRequiredRole = requiredRoles.some(requiredRole => userRoles.includes(requiredRole));

    if (!hasRequiredRole) {
      throw new ApiException(BadResponse.TOKEN_NOT_PROVIDED_OR_NOT_ROLE_PERMITION);
    }

    return true;
  }
}