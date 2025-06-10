import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

// Models
import { Role } from './entities/role.model';
import { UserRoleAssignment } from './entities/user_role.model'; 

// Repositories
import { RolesService } from './roles.service'; 
import { RolesRepository } from './repository/roles.repository'; 
import { UserRolesRepository } from './repository/user_roles.repository'; 

@Module({
  imports: [
    SequelizeModule.forFeature([Role, UserRoleAssignment]), 
  ],
  providers: [
    RolesService, 
    RolesRepository,
    UserRolesRepository,
  ],
  exports: [
    RolesService, 
    RolesRepository, 
    UserRolesRepository,
  ],
})
export class RolesModule {}