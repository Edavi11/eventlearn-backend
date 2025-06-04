import { OtpCode } from "../entities/otp_code.model";

import { OtpPurpose } from "src/common/enums/otp_purpose.enum";
import { OtpStatus } from "src/common/enums/otp_status.enum";


export interface IOtpCodesRepository {

  create(otpData: { user_id: number; code: string; purpose: OtpPurpose; expires_at: Date }): Promise<OtpCode>;

  updateStatus(criteria: Partial<{ user_id: number; purpose: OtpPurpose; status: OtpStatus }>, newStatus: OtpStatus)

  findValidOtp(user_id: number, code: string, purpose: OtpPurpose): Promise<OtpCode | null>;

  markAsUsed(otpId: number): Promise<[number]>;

  invalidatePreviousOtps(user_id: number, purpose: OtpPurpose): Promise<[number]>;

  findExpiredOtps(): Promise<OtpCode[]>;
}