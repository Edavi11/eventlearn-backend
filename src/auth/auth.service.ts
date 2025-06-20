// Imports
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

// NestJS
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

// Enums
import { Entities } from 'src/common/enums/entities';
import { OtpPurpose } from 'src/common/enums/otp_purpose.enum';

// Services
import { OtpService } from 'src/otp/otp.service';

// DTOs
import { CreateAuthDto, LoginUserDto, VerifyOtpDto, ForgotPasswordDto, VerifyResetOtpDto, ResetPasswordDto } from './dto/dtos';
import { SelectRoleDto } from './dto/select-role.dto';

// Repositories
import { UsersRepository } from 'src/users/repository/users.repository';
import { RolesRepository } from 'src/roles/repository/roles.repository';
import { UserRolesRepository } from 'src/roles/repository/user_roles.repository';

// Responses
import { GoodResponse, BadResponse, ApiResponse } from 'src/common/responses/responses';

// Exceptions
import { ApiException } from './exceptions/api.exception';

// Models
import { User } from 'src/users/entities/user.model';
import { ResponseModule } from 'src/common/enums/response_module.enum';

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

    try {
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

      if (createAuthDto.confirm_password !== password) {
        this.logger.error(`Password confirmation does not match for email ${email}`);
        throw new ApiException(BadResponse.PASSWORDS_DO_NOT_MATCH);
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
        throw new ApiException(BadResponse.FUNC_ENTITY_NOT_FOUND(Entities.ROLE));
      }

      await this.UserRolesRepository.create({
        user_id: user.id,
        role_id: assignedRole.id,
      });

      await this.otpService.sendOtp(user, OtpPurpose.REGISTRATION);

      return GoodResponse.USER_CREATED_OTP_SENT;
    } catch (error) {

      this.logger.error(`Error during user registration: ${error.message}`, error.stack);
      if (error instanceof ApiException) {
        throw error;
      }

      throw new BadRequestException(BadResponse.USER_CREATION_FAILED);
    }

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
      throw new ApiException(BadResponse.FUNC_ENTITY_NOT_FOUND(Entities.USER));
    }

    if (!userWithRoles.roles || userWithRoles.roles.length === 0) {
      throw new ApiException(BadResponse.TOKEN_NOT_PROVIDED_OR_NOT_ROLE_PERMITION);
    }

    const userRoles = userWithRoles.roles.map(role => role.rol);

    // Si el usuario solo tiene un rol, lo asignamos automáticamente
    const currentRole = userRoles.length === 1 ? userRoles[0] : null;

    const payload = {
      userCode: userWithRoles.code,
      email: userWithRoles.email,
      roles: userRoles,
      currentRole: currentRole
    };

    const accessToken = this.jwtService.sign(payload);
    return GoodResponse.FUNC_SIGNIN_SUCCESS(accessToken);
  }

  async selectRole(selectRoleDto: SelectRoleDto, user: User): Promise<ApiResponse<any>> {

    try {
      const { role } = selectRoleDto;

      if (!user.roles || user.roles.length === 0) {
        throw new ApiException(BadResponse.TOKEN_NOT_PROVIDED_OR_NOT_ROLE_PERMITION);
      }

      // Verificar que el usuario tenga el rol seleccionado
      const userRoles = user.roles.map(userRole => userRole.rol);
      if (!userRoles.includes(role)) {
        throw new ApiException(BadResponse.TOKEN_NOT_PROVIDED_OR_NOT_ROLE_PERMITION);
      }

      // Generar nuevo token con el rol seleccionado
      const payload = {
        userCode: user.code,
        email: user.email,
        roles: userRoles,
        currentRole: role
      };

      const accessToken = this.jwtService.sign(payload);
      return GoodResponse.FUNC_SIGNIN_SUCCESS(accessToken);
    } catch (error) {
      this.logger.error(`Error selecting role: ${error.message}`, error.stack);
      if (error instanceof ApiException) {
        throw error;
      }
      throw new ApiException(BadResponse.UNEXPECTED_ERROR(ResponseModule.AUTH));
    }
  }


  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<ApiResponse<any>> {
    const { email, otp_code } = verifyOtpDto;

    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new ApiException(BadResponse.FUNC_ENTITY_NOT_FOUND(Entities.USER));
    }

    await this.otpService.verifyOtp(user.id, otp_code, OtpPurpose.REGISTRATION);

    user.is_verified = true;
    await user.save();

    const userWithRoles = await this.usersRepository.findById(user.id);
    if (!userWithRoles) {
      throw new ApiException(BadResponse.FUNC_ENTITY_NOT_FOUND(Entities.USER));
    }

    const payload = {
      userCode: userWithRoles.code,
      email: userWithRoles.email,
      roles: userWithRoles.roles.map(role => role.rol)
    };

    const accessToken = this.jwtService.sign(payload);
    return GoodResponse.FUNC_OTP_VERIFIED_SUCCESS(accessToken);
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<ApiResponse> {
    const user = await this.usersRepository.findByEmail(dto.email);
    if (!user) {
      throw new ApiException(BadResponse.FUNC_ENTITY_NOT_FOUND(Entities.USER));
    }

    await this.otpService.sendResetPasswordOtp(user, OtpPurpose.PASSWORD_RESET);
    return GoodResponse.RESET_PASSWORD_OTP_SENT;
  }


  async verifyResetOtp(dto: VerifyResetOtpDto): Promise<ApiResponse> {
    const user = await this.usersRepository.findByEmail(dto.email);
    if (!user) {
      throw new ApiException(BadResponse.FUNC_ENTITY_NOT_FOUND(Entities.USER));
    }

    if (user.is_verified === false) {
      throw new ApiException(BadResponse.USER_NOT_VERIFY);
    }

    await this.usersRepository.update(user.id, { can_reset_password: true });

    await this.otpService.verifyOtp(user.id, dto.otp_code, OtpPurpose.PASSWORD_RESET);
    return GoodResponse.OTP_VERIFIED_SUCCESS;
  }

  async resetPassword(dto: ResetPasswordDto): Promise<ApiResponse> {
    const { email, new_password, confirm_password } = dto;

    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new ApiException(BadResponse.FUNC_ENTITY_NOT_FOUND(Entities.USER));
    }

    if (!user.can_reset_password) {
      throw new ApiException(BadResponse.PASSWORD_RESET_UNAUTHORIZED);
    }

    if (new_password !== confirm_password) {
      throw new ApiException(BadResponse.PASSWORDS_DO_NOT_MATCH);
    }

    user.password = await bcrypt.hash(new_password, 10);
    await this.usersRepository.update(user.id, { password: user.password, can_reset_password: false });

    return GoodResponse.PASSWORD_RESET_SUCCESS;
  }
}