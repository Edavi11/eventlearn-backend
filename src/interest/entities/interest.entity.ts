// src/interests/entities/interest.model.ts
import { Table, Column, Model, DataType, PrimaryKey, Unique, BelongsToMany, AutoIncrement } from 'sequelize-typescript';

import { StudentProfile } from 'src/profile/entities/student-profile.entity';
import { StudentInterest } from './student_interests.entity';

@Table({ tableName: 'interests', timestamps: true, paranoid: true }) 
export class Interest extends Model<Interest> {

    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER })
    id: number;

    @Unique(true)
    @Column({ type: DataType.STRING, allowNull: false })
    name: string; 

    @Column({ type: DataType.TEXT, allowNull: true })
    description: string;

    @BelongsToMany(() => StudentProfile, () => StudentInterest)
    studentProfiles: StudentProfile[];
}