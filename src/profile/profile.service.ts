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
import { InterestsRepository } from 'src/interest/repository/interests.repository';
import { StudentProfileRepository } from './repository/student-profile.repository';
import { InstructorProfileRepository } from './repository/instructor-profile.repository';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly interestsRepository: InterestsRepository,
    private readonly studentProfileRepository: StudentProfileRepository,
    private readonly instructorProfileRepository: InstructorProfileRepository,

  ) { }

  async createProfile(userCode: string, currentRole: UserRole, createProfileDto: CreateStudentProfileDto | CreateInstructorProfileDto,): Promise<ApiResponse<any>> {
    try {
      const user = await this.usersRepository.findByCode(userCode);

      if (!user) throw new ApiException(BadResponse.FUNC_ENTITY_NOT_FOUND(Entities.USER));

      await this.ensureProfileNotExists(user.id, currentRole);

      switch (currentRole) {
        case UserRole.STUDENT:
          return this.createStudentProfile(user.id, createProfileDto as CreateStudentProfileDto);
        case UserRole.INSTRUCTOR:
          return this.createInstructorProfile(user.id, createProfileDto as CreateInstructorProfileDto);
        default:
          throw new ApiException(BadResponse.UNAUTHORIZED_ACCESS);
      }
    } catch (error) {
      this.logger.error(`Error creating profile: ${error.message}`, error.stack);
      if (error instanceof ApiException) throw error;
      throw new ApiException(BadResponse.UNEXPECTED_ERROR(ResponseModule.PROFILE));
    }
  }

  private async ensureProfileNotExists(userId: number, role: UserRole): Promise<void> {
    const exists =
      role === UserRole.STUDENT
        ? await this.studentProfileRepository.existsByUserId(userId)
        : await this.instructorProfileRepository.existsByUserId(userId);

    if (exists) throw new ApiException(BadResponse.UNIQUE_DATA_IN_USE);
  }


  private async createStudentProfile(userId: number, dto: CreateStudentProfileDto): Promise<ApiResponse<any>> {
    const { interests, profile_picture_url, ...profileData } = dto;

    const interestIds = interests?.length
      ? (
        await this.interestsRepository.findAllByCodes(interests)
      ).map((i) => i.id)
      : [];

    const fullProfilePictureUrl = profile_picture_url
      ? this.buildPublicUrl(profile_picture_url)
      : null;

    const studentProfile = await this.studentProfileRepository.create({
      user_id: userId,
      profile_picture_url: fullProfilePictureUrl,
      ...profileData,
    });

    if (interestIds.length > 0) {
      await this.studentProfileRepository.setInterests(studentProfile, interestIds);
    }

    return GoodResponse.SUCCESSFUL_CREATION;
  }

  private async createInstructorProfile(userId: number, dto: CreateInstructorProfileDto): Promise<ApiResponse<any>> {
    const { profile_picture_url, ...profileData } = dto;

    const fullProfilePictureUrl = profile_picture_url
      ? this.buildPublicUrl(profile_picture_url)
      : null;

    await this.instructorProfileRepository.create({
      user_id: userId,
      profile_picture_url: fullProfilePictureUrl,
      ...profileData,
    });

    return GoodResponse.SUCCESSFUL_CREATION;
  }

  private buildPublicUrl(relativePath: string): string {
    const env = process.env.NODE_ENV || 'dev';

    const baseUrls = {
      dev: 'http://localhost:3000',
      sta: process.env.STAGING_URL || 'https://staging.eventlearn.com',
      prod: process.env.PROD_URL || 'https://eventlearn.com',
    };

    const baseUrl = baseUrls[env] || baseUrls.dev;

    // Asegura que relativePath comience con '/'
    const sanitizedPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;

    return `${baseUrl}${sanitizedPath}`;
  }

  async getProfile(userCode: string, currentRole: UserRole): Promise<ApiResponse<any>> {
    try {
      const user = await this.usersRepository.findByCode(userCode);
      if (!user) {
        throw new ApiException(BadResponse.FUNC_ENTITY_NOT_FOUND(Entities.USER));
      }

      switch (currentRole) {
        case UserRole.STUDENT: {
          const profile = await this.studentProfileRepository.findByUserId(user.id);
          return GoodResponse.SUCCESSFUL_GET(profile, ResponseModule.PROFILE);
        }
        case UserRole.INSTRUCTOR: {
          const profile = await this.instructorProfileRepository.findByUserId(user.id);
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
      throw new ApiException(BadResponse.UNEXPECTED_ERROR(ResponseModule.PROFILE));
    }
  }
}
