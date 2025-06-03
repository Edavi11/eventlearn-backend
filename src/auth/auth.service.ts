// Imports
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

// NestJS
import { Injectable, Logger } from '@nestjs/common';

// DTOs
import { LoginUserDto } from './dto/login-auth.dto';
import { CreateAuthDto } from './dto/create-auth.dto';

// Repositories
import { UsersRepository } from 'src/users/repository/users.repository';
import { RolesRepository } from 'src/roles/repository/roles.repository';
import { UserRolesRepository } from 'src/roles/repository/user_roles.repository';
import { OtpService } from 'src/otp/otp.service';
import { OtpPurpose } from 'src/common/enums/otp_purpose.enum';
import { VerifyOtpDto } from './dto/verify-otp.dto';

// Responses
import { GoodResponse } from 'src/common/responses/good_response';
import { BadResponse } from 'src/common/responses/bad_response';
import { ApiResponse } from 'src/common/responses/structure/api-response.dto';

// Exceptions
import { ApiException } from './exceptions/api.exception';
import { Entities } from 'src/common/enums/entities';

@Injectable()
export class AuthService {

  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesRepository: RolesRepository,
    private readonly UserRolesRepository: UserRolesRepository,
    private jwtService: JwtService,
    private otpService: OtpService
  ) { }

  async signUp(createAuthDto: CreateAuthDto): Promise<ApiResponse> {
    const { email, password, first_name, last_name, role } = createAuthDto;

    let user = await this.usersRepository.findByEmail(email);

    if (user) {
      if (user.is_verified) {
        throw new ApiException(BadResponse.USER_ALREADY_EXISTS);
      } else {
        this.logger.warn(`Attempt to register unverified email ${email}. Delegating OTP re-send.`);
        await this.otpService.sendOtp(user, OtpPurpose.REGISTRATION);
        return GoodResponse.USER_UNVERIFIED_OTP_RESENT;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await this.usersRepository.create({
      email,
      password: hashedPassword,
      name: `${first_name} ${last_name}`,
      is_verified: false,
      is_active: true,
    });

    const assignedRole = await this.rolesRepository.findByRol(role);
    if (!assignedRole) {
      this.logger.error(`Role '${role}' not found in database. Please ensure seed is run.`);
      throw new ApiException(BadResponse.FUNC_ENTITY_NOT_FOUND(Entities.Role));
    }

    await this.UserRolesRepository.create({
      user_id: user.id,
      role_id: assignedRole.id,
    });

    await this.otpService.sendOtp(user, OtpPurpose.REGISTRATION);

    return GoodResponse.USER_CREATED_OTP_SENT;
  }

  async signIn(loginUserDto: LoginUserDto): Promise<ApiResponse<any>> {
    const { email, password } = loginUserDto;

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new ApiException(BadResponse.USER_NOT_EXISTS);
    }

    if (!user.is_verified) {
      throw new ApiException(BadResponse.USER_NOT_VERIFY);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiException(BadResponse.USER_PASSWORD_IS_INVALID);
    }

    await this.usersRepository.update(user.id, {
      last_login_at: new Date(),
    });

    const userWithRoles = await this.usersRepository.findById(user.id);
    if (!userWithRoles) {
      throw new ApiException(BadResponse.FUNC_ENTITY_NOT_FOUND(Entities.User));
    }

    const payload = {
      userCode: userWithRoles.code,
      email: userWithRoles.email,
      roles: userWithRoles.roles.map(role => role.rol),
    };

    const accessToken = this.jwtService.sign(payload);
    return GoodResponse.SIGNIN_SUCCESS(accessToken)
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<ApiResponse<any>> {
    const { email, otp_code } = verifyOtpDto;

    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new ApiException(BadResponse.FUNC_ENTITY_NOT_FOUND(Entities.User));
    }

    const result = await this.otpService.verifyOtp(user.id, otp_code, OtpPurpose.REGISTRATION);

    if (!result.is_verified) {
      throw new ApiException(BadResponse.USER_NOT_VERIFY);
    }

    user.is_verified = true;
    await user.save();

    const userWithRoles = await this.usersRepository.findById(user.id);
    if (!userWithRoles) {
      throw new ApiException(BadResponse.FUNC_ENTITY_NOT_FOUND(Entities.User));
    }

    const payload = {
      userCode: userWithRoles.code,
      email: userWithRoles.email,
      roles: userWithRoles.roles.map(role => role.rol)
    };

    const accessToken = this.jwtService.sign(payload);
    return GoodResponse.OTP_VERIFIED_SUCCESS(accessToken);
  }
}