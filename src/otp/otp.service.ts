import { Injectable, Logger } from '@nestjs/common';

// Services
import { EmailService } from '../email/email.service';

// Models
import { User } from '../users/entities/user.model';

// Repositories
import { OtpCodesRepository } from './repository/otp_codes.repository';

// Enums
import { OtpPurpose } from 'src/common/enums/otp_purpose.enum';

// Responses
import { BadResponse } from 'src/common/responses/responses';

// Exceptions
import { ApiException } from 'src/auth/exceptions/api.exception';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(private readonly otpCodesRepository: OtpCodesRepository, private readonly emailService: EmailService) { }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(user: User, purpose: OtpPurpose): Promise<void> {

    await this.otpCodesRepository.invalidatePreviousOtps(user.id, purpose);

    const otpCode = this.generateOtp();
    const otpExpiresAt = new Date(Date.now() + 3 * 60 * 1000);

    await this.otpCodesRepository.create({
      user_id: user.id,
      code: otpCode,
      purpose: purpose,
      expires_at: otpExpiresAt,
    });

    this.logger.log(`OTP generated and saved for user ${user.email} (Purpose: ${purpose})`);

    try {
      await this.emailService.sendVerificationOtp(user.email, otpCode);
      this.logger.log(`OTP email sent to ${user.email}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${user.email}:`, error.message);
      throw new ApiException(BadResponse.OTP_EMAIL_SEND_FAILED);
    }
  }

  async sendResetPasswordOtp(user: User, purpose: OtpPurpose): Promise<void> {
    await this.otpCodesRepository.invalidatePreviousOtps(user.id, purpose);

    const otpCode = this.generateOtp();
    const otpExpiresAt = new Date(Date.now() + 3 * 60 * 1000);

    await this.otpCodesRepository.create({
      user_id: user.id,
      code: otpCode,
      purpose: OtpPurpose.PASSWORD_RESET,
      expires_at: otpExpiresAt,
    });

    this.logger.log(`🔐 OTP for password reset generated for ${user.email}`);

    try {
      await this.emailService.sendPasswordResetOtp(user.email, otpCode);
      this.logger.log(`📧 Password reset OTP email sent to ${user.email}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send password reset email to ${user.email}:`, error.message);
      throw new ApiException(BadResponse.OTP_EMAIL_SEND_FAILED);
    }
  }


  async verifyOtp(userId: number, otpCode: string, purpose: OtpPurpose): Promise<User> {
    const otpRecord = await this.otpCodesRepository.findValidOtp(userId, otpCode, purpose);

    if (!otpRecord) {
      throw new ApiException(BadResponse.INVALID_OTP);
    }

    await this.otpCodesRepository.markAsUsed(otpRecord.id);
    this.logger.log(`OTP ${otpRecord.id} marked as used for user ${userId}`);

    return otpRecord.user;
  }
}