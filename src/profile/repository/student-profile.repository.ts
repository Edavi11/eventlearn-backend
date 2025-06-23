import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StudentProfile } from '../entities/student-profile.entity';

@Injectable()
export class StudentProfileRepository {
  constructor(
    @InjectModel(StudentProfile)
    private readonly studentProfileModel: typeof StudentProfile,
  ) { }

  async create(data: Partial<StudentProfile>): Promise<StudentProfile> {
    return this.studentProfileModel.create(data);
  }

  async findByUserId(userId: number): Promise<StudentProfile | null> {
    return this.studentProfileModel.findOne({
      where: { user_id: userId },
      include: [
        { association: 'interests' },
        { association: 'user', attributes: ['code', 'email', 'name'] }
      ]
    });
  }

  async setInterests(profile: StudentProfile, interestIds: number[]): Promise<void> {
    await profile.$set('interests', interestIds);
  }

  async existsByUserId(userId: number): Promise<boolean> {
    const profile = await this.studentProfileModel.findOne({
      where: { user_id: userId },
    });
    return !!profile;
  }

  async update(profile: StudentProfile, data: Partial<StudentProfile>): Promise<StudentProfile> {
    return await profile.update(data);
  }

}
