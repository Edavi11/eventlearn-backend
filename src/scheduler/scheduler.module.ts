import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { OtpCodesRepository } from 'src/otp/repository/otp_codes.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { OtpCode } from 'src/otp/entities/otp_code.model';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    SequelizeModule.forFeature([OtpCode]),
  ],
  providers: [SchedulerService, OtpCodesRepository],
})
export class SchedulerModule {}
