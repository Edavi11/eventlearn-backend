import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from 'src/common/enums/user.role';

export class SelectRoleDto {
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}