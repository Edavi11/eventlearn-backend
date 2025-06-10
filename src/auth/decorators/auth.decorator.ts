import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../../common/enums/user.role';
import { RolesProtected } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

export function Auth(...roles: UserRole[]) {
  return applyDecorators(
    RolesProtected(...roles),
    UseGuards(AuthGuard('jwt'), RolesGuard),
  );
}