import { UserRole } from "src/common/enums/user.role";

export interface JwtPayload {
  email: string;
  userCode: string;
  currentRole?: string,
  roles: UserRole[];
}
