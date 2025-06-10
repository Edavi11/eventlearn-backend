import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, AllowNull, Default, BelongsToMany } from 'sequelize-typescript';

import { User } from '../../users/entities/user.model';

import { EducationalLevel } from 'src/common/enums/educational-level.enum';
import { Interest } from 'src/interest/entities/interest.entity';
import { StudentInterest } from 'src/interest/entities/student_interests.entity';

@Table({ tableName: 'student_profiles', timestamps: true, paranoid: true })
export class StudentProfile extends Model<StudentProfile> {

    @PrimaryKey
    @AutoIncrement 
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false, unique: true })
    user_id: number;

    @BelongsTo(() => User)
    user: User;

    @Column({ type: DataType.TEXT, allowNull: true })
    profile_picture_url: string;

    @AllowNull(true)
    @Column({ type: DataType.ENUM(...Object.values(EducationalLevel)), defaultValue: EducationalLevel.NONE })
    educational_level: EducationalLevel;

    @AllowNull(true)
    @Column({ type: DataType.TEXT })
    learning_goals: string;

    @Default(0)
    @AllowNull(false)
    @Column({ type: DataType.INTEGER })
    num_events_subscribed: number;

    @BelongsToMany(() => Interest, () => StudentInterest)
    interests: Interest[];
}