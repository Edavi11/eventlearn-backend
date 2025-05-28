import { Table, Model, Column, ForeignKey, DataType } from 'sequelize-typescript';

import { User } from '../../users/entities/user.model';
import { Role } from './role.model';

@Table({
  tableName: 'user_roles',
  timestamps: true,
  paranoid: true,
})
export class UserRoleAssignment extends Model<UserRoleAssignment> {

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id: number;

  @ForeignKey(() => Role)
  @Column(DataType.INTEGER)
  role_id: number;
  
}
