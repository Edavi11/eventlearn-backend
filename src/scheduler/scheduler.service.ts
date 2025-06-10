import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OtpCodesRepository } from 'src/otp/repository/otp_codes.repository';
import { OtpStatus } from 'src/common/enums/otp_status.enum';

@Injectable()
export class SchedulerService {
    private readonly logger = new Logger(SchedulerService.name);

    constructor(private readonly otpCodesRepository: OtpCodesRepository) { }

    @Cron(CronExpression.EVERY_30_SECONDS)
    async expireOldOtps() {
        const expiredCount = await this.otpCodesRepository.updateStatus(
            { status: OtpStatus.PENDING },
            OtpStatus.EXPIRED,
        );

        if (expiredCount > 0) {
            this.logger.log(`✅ ${expiredCount} OTP(s) marked as expired.`);
        }
    }
}
