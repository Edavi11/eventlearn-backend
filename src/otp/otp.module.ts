import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { OtpCode } from './entities/otp_code.model';

import { OtpCodesRepository } from './repository/otp_codes.repository';
import { OtpService } from './otp.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [ SequelizeModule.forFeature([OtpCode]), EmailModule],
  providers: [OtpCodesRepository, OtpService],
  exports: [OtpCodesRepository, OtpService],
})
export class OtpModule {}