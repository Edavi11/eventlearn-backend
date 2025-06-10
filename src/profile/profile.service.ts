import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/entities/user.model';
import { StudentProfile } from './entities/student-profile.entity';
import { InstructorProfile } from './entities/instructor-profile.entity';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { CreateInstructorProfileDto } from './dto/create-instructor-profile.dto';
import { UserRole } from 'src/common/enums/user.role';
import { ApiResponse } from 'src/common/responses/responses';
import { GoodResponse, BadResponse } from 'src/common/responses/responses';
import { ApiException } from 'src/auth/exceptions/api.exception';
import { Entities } from 'src/common/enums/entities';
import { ResponseModule } from 'src/common/enums/response_module.enum';
import { UsersRepository } from 'src/users/repository/users.repository';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    @InjectModel(StudentProfile)
    private studentProfileModel: typeof StudentProfile,
    @InjectModel(InstructorProfile)
    private instructorProfileModel: typeof InstructorProfile,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createProfile(userCode: string, currentRole: UserRole, createProfileDto: CreateStudentProfileDto | CreateInstructorProfileDto): Promise<ApiResponse<any>> {
    try {
      const user = await this.usersRepository.findByCode(userCode);
      if (!user) {
        throw new ApiException(BadResponse.FUNC_ENTITY_NOT_FOUND(Entities.USER));
      }

      // Verificar si el usuario ya tiene un perfil
      const existingStudentProfile = await this.studentProfileModel.findOne({ where: { user_id: user.id } });
      const existingInstructorProfile = await this.instructorProfileModel.findOne({ where: { user_id: user.id } });

      if (existingStudentProfile || existingInstructorProfile) {
        throw new ApiException(BadResponse.UNIQUE_DATA_IN_USE);
      }

      switch (currentRole) {
        case UserRole.STUDENT: {
          const { interests, ...profileData } = createProfileDto as CreateStudentProfileDto;
          const studentProfile = await this.studentProfileModel.create({ 
            user_id: user.id, 
            ...profileData 
          });

          if (interests && interests.length > 0) {
            await studentProfile.$set('interests', interests);
          }

          return GoodResponse.SUCCESSFUL_CREATION;
        }
        case UserRole.INSTRUCTOR: {
          const instructorProfile = await this.instructorProfileModel.create({
            user_id: user.id,
            ...createProfileDto as CreateInstructorProfileDto,
          });

          return GoodResponse.SUCCESSFUL_CREATION;
        }
        default:
          throw new ApiException(BadResponse.UNAUTHORIZED_ACCESS);
      }
    } catch (error) {
      this.logger.error(`Error creating profile: ${error.message}`, error.stack);
      if (error instanceof ApiException) {
        throw error;
      }
      throw new ApiException(BadResponse.ENTITY_NOT_FOUND);
    }
  }

  async getProfile(userCode: string, currentRole: UserRole): Promise<ApiResponse<any>> {
    try {
      const user = await this.usersRepository.findByCode(userCode);
      if (!user) {
        throw new ApiException(BadResponse.FUNC_ENTITY_NOT_FOUND(Entities.USER));
      }

      switch (currentRole) {
        case UserRole.STUDENT: {
          const profile = await this.studentProfileModel.findOne({
            where: { user_id: user.id },
            include: ['interests']
          });
          return GoodResponse.SUCCESSFUL_GET(profile, ResponseModule.PROFILE);
        }
        case UserRole.INSTRUCTOR: {
          const profile = await this.instructorProfileModel.findOne({
            where: { user_id: user.id }
          });
          return GoodResponse.SUCCESSFUL_GET(profile, ResponseModule.PROFILE);
        }
        default:
          throw new ApiException(BadResponse.UNAUTHORIZED_ACCESS);
      }
    } catch (error) {
      this.logger.error(`Error getting profile: ${error.message}`, error.stack);
      if (error instanceof ApiException) {
        throw error;
      }
      throw new ApiException(BadResponse.ENTITY_NOT_FOUND);
    }
  }
}
