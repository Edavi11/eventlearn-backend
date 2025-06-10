import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.model';
import { Role } from 'src/roles/entities/role.model';
import { UserRoleAssignment } from 'src/roles/entities/user_role.model';
import { UsersRepository } from './repository/users.repository';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    SequelizeModule.forFeature([User, Role, UserRoleAssignment]),
  ],
  providers: [UsersRepository],
  exports: [UsersRepository], 
})


export class UsersModule {}
