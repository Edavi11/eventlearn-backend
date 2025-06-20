import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InstructorProfile } from '../entities/instructor-profile.entity';

@Injectable()
export class InstructorProfileRepository {
  constructor(
    @InjectModel(InstructorProfile)
    private readonly instructorProfileModel: typeof InstructorProfile,
  ) { }

  async create(data: Partial<InstructorProfile>): Promise<InstructorProfile> {
    return this.instructorProfileModel.create(data);
  }

  async findByUserId(userId: number): Promise<InstructorProfile | null> {
    return this.instructorProfileModel.findOne({
      where: { user_id: userId },
    });
  }

  async existsByUserId(userId: number): Promise<boolean> {
    const profile = await this.instructorProfileModel.findOne({
      where: { user_id: userId },
    });
    return !!profile;
  }


}
