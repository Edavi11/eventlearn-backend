import { Role } from "../entities/role.model";

export interface IRoleRepository {
  findById(id: number): Promise<Role | null>;
  findByRol(code: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
}
