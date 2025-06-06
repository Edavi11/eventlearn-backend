import { User } from '../../users/entities/user.model';
import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo, Default, AllowNull, AutoIncrement } from 'sequelize-typescript';

@Table({ tableName: 'instructor_profiles', timestamps: true, paranoid: true })
export class InstructorProfile extends Model<InstructorProfile> {
    
    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER })
    id: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false, unique: true })
    user_id: number;

    @BelongsTo(() => User)
    user: User;

    @Column({ type: DataType.TEXT, allowNull: true })
    profile_picture_url: string;

    @AllowNull(true) 
    @Column({ type: DataType.STRING })
    title: string;

    @AllowNull(true)
    @Column({ type: DataType.TEXT })
    bio: string;

    @AllowNull(true)
    @Column({ type: DataType.JSONB }) 
    specialties: string[]; 

    @AllowNull(true)
    @Column({ type: DataType.JSONB })
    social_links: { platform: string; url: string }[];

    @AllowNull(true)
    @Column({ type: DataType.TEXT })
    teaching_experience: string;

    @Default(0.0) 
    @AllowNull(false)
    @Column({ type: DataType.DECIMAL(2, 1) }) 
    average_rating: number;

    @Default(0)
    @AllowNull(false)
    @Column({ type: DataType.INTEGER })
    num_events: number;

    @Default(0)
    @AllowNull(false)
    @Column({ type: DataType.INTEGER })
    num_subscribers: number;
}