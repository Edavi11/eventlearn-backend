// src/interests/entities/student-interest.model.ts
import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, AutoIncrement } from 'sequelize-typescript';

import { Interest } from './interest.entity';
import { StudentProfile } from 'src/profile/entities/student-profile.entity';

@Table({ tableName: 'student_interests', timestamps: true, paranoid: false }) 
export class StudentInterest extends Model<StudentInterest> {
        
    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER })
    id: number;

    @ForeignKey(() => StudentProfile)
    @Column({ type: DataType.INTEGER, allowNull: false })
    student_profile_id: number;

    @ForeignKey(() => Interest)
    @Column({ type: DataType.UUID, allowNull: false }) // 
    interest_id: string;

}