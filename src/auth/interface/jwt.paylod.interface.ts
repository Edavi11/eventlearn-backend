import { UserRole } from "src/common/enums/user.role";

export interface JwtPayload {
  email: string;
  userCode: string;  // User UUID público (del campo `code` del usuario)
  roles: UserRole[]; // Roles del usuario (ej: ['student', 'instructor'])
}
