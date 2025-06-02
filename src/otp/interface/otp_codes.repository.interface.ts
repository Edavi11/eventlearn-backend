// src/otp/repository/interfaces/otp-codes-repository.interface.ts

import { OtpPurpose } from "src/common/enums/otp_purpose.enum";
import { OtpCode } from "../otp_code.model";


export interface IOtpCodesRepository {

  create(otpData: { user_id: number; code: string; purpose: OtpPurpose; expires_at: Date }): Promise<OtpCode>;

  findValidOtp(user_id: number, code: string, purpose: OtpPurpose): Promise<OtpCode | null>;

  markAsUsed(otpId: number): Promise<[number]>;

  invalidatePreviousOtps(user_id: number, purpose: OtpPurpose): Promise<[number]>;

  findExpiredOtps(): Promise<OtpCode[]>;
}