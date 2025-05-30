import { Table, Model, Column, ForeignKey, DataType, Default } from 'sequelize-typescript';

import { User } from '../../users/entities/user.model';
import { Role } from './role.model';

@Table({
  tableName: 'user_roles',
  timestamps: true,
  paranoid: true,
})
export class UserRoleAssignment extends Model<UserRoleAssignment> {

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  code: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id: number;

  @ForeignKey(() => Role)
  @Column(DataType.INTEGER)
  role_id: number;
}
