import { Op } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

// Models
import { OtpCode } from '../entities/otp_code.model';
import { User } from '../../users/entities/user.model';

// Enums
import { OtpPurpose } from 'src/common/enums/otp_purpose.enum';

// Interfaces
import { IOtpCodesRepository } from '../interface/otp_codes.repository.interface';
import { OtpStatus } from 'src/common/enums/otp_status.enum';

@Injectable()
export class OtpCodesRepository implements IOtpCodesRepository {

    constructor(@InjectModel(OtpCode) private otpCodeModel: typeof OtpCode) { }

    async create(otpData: { user_id: number; code: string; purpose: OtpPurpose; expires_at: Date }): Promise<OtpCode> {
        return await this.otpCodeModel.create({ ...otpData, status: OtpStatus.PENDING });
    }

    async findValidOtp(user_id: number, code: string, purpose: OtpPurpose): Promise<OtpCode | null> {
        return this.otpCodeModel.findOne({
            where: {
                user_id,
                code,
                purpose,
                status: OtpStatus.PENDING,
                expires_at: { [Op.gt]: new Date() },
            },
            include: [User],
        });

    }

    async markAsUsed(otpId: number): Promise<[number]> {
        return this.otpCodeModel.update({ status: OtpStatus.USED }, { where: { id: otpId } });
    }

    async invalidatePreviousOtps(user_id: number, purpose: OtpPurpose): Promise<[number]> {
        return this.otpCodeModel.update(
            { status: OtpStatus.REPLACED },
            {
                where: {
                    user_id,
                    purpose,
                    status: OtpStatus.PENDING,
                    expires_at: { [Op.gt]: new Date() },
                },
            },
        );
    }

    async findExpiredOtps(): Promise<OtpCode[]> {
        return this.otpCodeModel.findAll({
            where: {
                expires_at: { [Op.lt]: new Date() },
                status: OtpStatus.PENDING,
            },
        });
    }

    async updateStatus(criteria: Partial<{ user_id: number; purpose: OtpPurpose; status: OtpStatus }>, newStatus: OtpStatus): Promise<number> {
        const [affectedRows] = await this.otpCodeModel.update(
            { status: newStatus },
            {
                where: {
                    ...criteria,
                    expires_at: { [Op.lt]: new Date() },
                },
            },
        );
        return affectedRows;
    }
}