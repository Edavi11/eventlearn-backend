import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Default, BelongsToMany } from 'sequelize-typescript';

// Models
import { User } from 'src/users/entities/user.model';
import { UserRoleAssignment } from './user_role.model';

// Enums
import { UserRole } from 'src/common/enums/user.role';

@Table({ tableName: 'roles', timestamps: true, paranoid: true })
export class Role extends Model<Role> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: DataType.ENUM(...Object.values(UserRole)), allowNull: false, unique: true})
  name: UserRole;

  @BelongsToMany(() => User, () => UserRoleAssignment)
  users: User[];
}
