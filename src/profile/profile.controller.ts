import { Controller, Post, Get, Body, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { CreateInstructorProfileDto } from './dto/create-instructor-profile.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRole } from 'src/common/enums/user.role';
import { ApiResponse } from 'src/common/responses/responses';
import { JwtPayload } from 'src/auth/interface/jwt.paylod.interface';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @Auth(UserRole.STUDENT, UserRole.INSTRUCTOR)
  @UseInterceptors(FileInterceptor('profile_picture'))
  async createProfile(
    @Body() createProfileDto: CreateStudentProfileDto | CreateInstructorProfileDto, @UploadedFile() file: Express.Multer.File, @Req() req: any): Promise<ApiResponse<any>> {
    const { userCode, currentRole } = req.user as JwtPayload;
    
    if (file) {
      createProfileDto.profile_picture_url = `/uploads/images/${file.filename}`;
    }
    
    return this.profileService.createProfile(userCode, currentRole as UserRole, createProfileDto);
  }

  @Get()
  @Auth(UserRole.STUDENT, UserRole.INSTRUCTOR)
  async getProfile(@Req() req: any): Promise<ApiResponse<any>> {
    const { userCode, currentRole } = req.user as JwtPayload;
    return this.profileService.getProfile(userCode, currentRole as UserRole);
  }
}
