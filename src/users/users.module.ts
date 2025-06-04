import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.model';
import { Role } from 'src/roles/entities/role.model';
import { UserRoleAssignment } from 'src/roles/entities/user_role.model';
import { UsersRepository } from './repository/users.repository';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Role, UserRoleAssignment]), // Provee el modelo User para la inyección
  ],
  providers: [UsersRepository], // <--- Ahora provees el UsersRepository
  exports: [UsersRepository], // <--- Exporta UsersService Y UsersRepository
})


export class UsersModule {}
