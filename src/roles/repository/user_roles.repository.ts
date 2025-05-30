import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserRoleAssignment } from '../entities/user_role.model';
import { IUserRoleAssignmentRepository } from '../interfaces/user_role.interface';

@Injectable()
export class UserRolesRepository implements IUserRoleAssignmentRepository {

  constructor( @InjectModel(UserRoleAssignment) private roleModel: typeof UserRoleAssignment ) {}

    create(userRoleData: Partial<UserRoleAssignment>): Promise<UserRoleAssignment> {
        return this.roleModel.create(userRoleData as UserRoleAssignment);
    }
    
    findByRolId(code: string): Promise<UserRoleAssignment | null> {
        throw new Error('Method not implemented.');
    }

    findById(id: number): Promise<UserRoleAssignment | null> {
        return this.roleModel.findByPk(id);
    }

    findByUserId(id: number): Promise<UserRoleAssignment | null> {
        // return this.roleModel.findOne({ where: { userId: id } });
        throw new Error('Method not implemented.');
    }

    findAll(): Promise<UserRoleAssignment[]> {
        return this.roleModel.findAll();
    }
}
