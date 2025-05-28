// Imports
import { v4 as uuidv4 } from 'uuid';
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Default, BelongsToMany } from 'sequelize-typescript';

import { Role } from 'src/roles/entities/role.model';
import { UserRoleAssignment } from 'src/roles/entities/user_role.model';

@Table({ tableName: 'users', timestamps: true, paranoid: true })
export class User extends Model<User> {
    
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID,allowNull: false, unique: true })
  internal_code: string;

  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  code: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: true, })
  name: string;

  @BelongsToMany(() => Role, () => UserRoleAssignment)
  roles: Role[];
}