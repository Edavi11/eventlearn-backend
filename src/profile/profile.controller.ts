import { Controller, Post, Get, Body, UseInterceptors, UploadedFile, Req, Put } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { CreateInstructorProfileDto } from './dto/create-instructor-profile.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRole } from 'src/common/enums/user.role';
import { ApiResponse } from 'src/common/responses/responses';
import { DynamicUploadInterceptor } from 'src/uploads/interceptors/dynamic-upload.interceptor';
import { UploadCategory } from 'src/uploads/enums/upload-category.enum';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';
import { UpdateInstructorProfileDto } from './dto/update-instructor-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Post()
  @Auth(UserRole.STUDENT, UserRole.INSTRUCTOR)
  @DynamicUploadInterceptor('profile_picture', UploadCategory.PROFILE)
  async createProfile(
    @Body() createProfileDto: CreateStudentProfileDto | CreateInstructorProfileDto, @UploadedFile() file: Express.Multer.File, @Req() req: any): Promise<ApiResponse<any>> {

    const { code, currentRole } = req.user;

    if (file) {
      createProfileDto.profile_picture_url = `/uploads/${code}/${UploadCategory.PROFILE}/${file.filename}`;
    }

    return this.profileService.createProfile(code, currentRole as UserRole, createProfileDto);
  }

  @Get()
  @Auth(UserRole.STUDENT, UserRole.INSTRUCTOR)
  async getProfile(@Req() req: any): Promise<ApiResponse<any>> {
    const { code, currentRole } = req.user;
    return this.profileService.getProfile(code, currentRole as UserRole);
  }


  @Put()
  @Auth(UserRole.STUDENT, UserRole.INSTRUCTOR)
  @DynamicUploadInterceptor('profile_picture', UploadCategory.PROFILE)
  async updateProfile(@Req() req: any, @Body() body: UpdateStudentProfileDto | UpdateInstructorProfileDto, @UploadedFile() file: Express.Multer.File): Promise<ApiResponse<any>> {
    const { code, currentRole } = req.user;

    if (file) {
      body.profile_picture_url = `/uploads/${code}/${UploadCategory.PROFILE}/${file.filename}`;
    }

    return this.profileService.updateProfile(code, currentRole, body);
  }
}
