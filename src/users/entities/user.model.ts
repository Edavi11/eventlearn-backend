import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Default, BelongsToMany, Unique, AllowNull } from 'sequelize-typescript';

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

  @Unique(true)
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  password: string;

  @Column({ type: DataType.STRING, allowNull: true, })
  name: string;
  
  @Column({ type: DataType.DATE, allowNull: true, })
  last_login_at: Date;

  @Default(true)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  is_active: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_verified: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  can_reset_password : boolean;

  @BelongsToMany(() => Role, () => UserRoleAssignment)
  roles: Role[];
  
}