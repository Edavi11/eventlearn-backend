import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '../entities/role.model';
import { UserRole } from 'src/common/enums/user.role';
import { IRoleRepository } from '../interfaces/roles.interface';

@Injectable()
export class RolesRepository implements IRoleRepository {

  constructor( @InjectModel(Role) private roleModel: typeof Role ) {}

  findById(id: number): Promise<Role | null> {
    return this.roleModel.findByPk(id);
  }
  
  findByRol(rol: UserRole): Promise<Role | null> {
    return this.roleModel.findOne({ where: { rol } });
  }

  findAll(): Promise<Role[]> {
    return this.roleModel.findAll();
  }
}
