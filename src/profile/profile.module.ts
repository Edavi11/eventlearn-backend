import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { StudentProfile } from './entities/student-profile.entity';
import { InstructorProfile } from './entities/instructor-profile.entity';
import { Interest } from 'src/interest/entities/interest.entity';
import { StudentInterest } from 'src/interest/entities/student_interests.entity';
import { UploadsModule } from 'src/uploads/uploads.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    SequelizeModule.forFeature([StudentProfile, InstructorProfile, Interest, StudentInterest]),
    UploadsModule,
    UsersModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
