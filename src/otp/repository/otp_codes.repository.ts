// src/otp/repository/otp-codes.repository.ts
import { Op } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

// Models
import { OtpCode } from '../otp_code.model';
import { User } from '../../users/entities/user.model';

// Enums
import { OtpPurpose } from 'src/common/enums/otp_purpose.enum';

// Interfaces
import { IOtpCodesRepository } from '../interface/otp_codes.repository.interface';

@Injectable()
export class OtpCodesRepository implements IOtpCodesRepository {
    constructor(
        @InjectModel(OtpCode)
        private otpCodeModel: typeof OtpCode,
    ) { }

    async create(otpData: { user_id: number; code: string; purpose: OtpPurpose; expires_at: Date }): Promise<OtpCode> {
        return this.otpCodeModel.create(otpData as any);
    }

    async findValidOtp(user_id: number, code: string, purpose: OtpPurpose): Promise<OtpCode | null> {
        return this.otpCodeModel.findOne({
            where: {
                user_id,
                code,
                purpose,
                expires_at: { [Op.gt]: new Date() },
                is_used: false,
            },
            include: [User],
        });
    }


    async markAsUsed(otpId: number): Promise<[number]> {
        return this.otpCodeModel.update({ is_used: true }, { where: { id: otpId } });
    }

    async invalidatePreviousOtps(user_id: number, purpose: OtpPurpose): Promise<[number]> {
        return this.otpCodeModel.update({ is_used: true }, {
            where: {
                user_id,
                purpose,
                is_used: false,
                expires_at: { [Op.gt]: new Date() }, // Solo invalida los que aún no han expirado
            }
        });
    }

    async findExpiredOtps(): Promise<OtpCode[]> {
        return this.otpCodeModel.findAll({
            where: {
                expires_at: { [Op.lt]: new Date() },
                is_used: false,
            },
        });
    }
}