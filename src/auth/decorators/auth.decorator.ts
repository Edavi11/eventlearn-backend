// src/auth/decorators/auth.decorator.ts
import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // Este AuthGuard hace la autenticación JWT
import { UserRole } from '../../common/enums/user.role'; // Tu enum de roles
import { RolesProtected } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

export function Auth(...roles: UserRole[]) {
  return applyDecorators(
    RolesProtected(...roles),
    UseGuards(AuthGuard('jwt'), RolesGuard),
  );
}