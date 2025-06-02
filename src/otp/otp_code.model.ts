import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { OtpPurpose } from 'src/common/enums/otp_purpose.enum';
import { User } from 'src/users/entities/user.model';

@Table({ tableName: 'otp_codes', timestamps: true,  paranoid: true })
export class OtpCode extends Model<OtpCode> {

  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @ForeignKey(() => User) 
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @Column({ type: DataType.STRING(6), allowNull: false })
  code: string;

  @Column({ type: DataType.ENUM(...Object.values(OtpPurpose)), allowNull: false })
  purpose: OtpPurpose;

  @Column({ type: DataType.DATE, allowNull: false })
  expires_at: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: false, allowNull: false })
  is_used: boolean;
}
