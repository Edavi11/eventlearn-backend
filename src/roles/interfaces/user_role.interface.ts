import { UserRoleAssignment } from "../entities/user_role.model";

export interface IUserRoleAssignmentRepository {
    create(userRoleData: Partial<UserRoleAssignment>): Promise<UserRoleAssignment>;
    findById(id: number): Promise<UserRoleAssignment | null>;
    findByUserId(id: number): Promise<UserRoleAssignment | null>;
    findByRolId(code: string): Promise<UserRoleAssignment | null>;
    findAll(): Promise<UserRoleAssignment[]>;
}