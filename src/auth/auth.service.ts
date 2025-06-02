// Imports
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

// NestJS
import { BadRequestException, Injectable, UnauthorizedException, Logger, InternalServerErrorException } from '@nestjs/common';

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

  async signUp(createAuthDto: CreateAuthDto): Promise<{ message: string }> {
    const { email, password, first_name, last_name, role } = createAuthDto;

    let user = await this.usersRepository.findByEmail(email);

    if (user) {
      if (user.is_verified) {
        throw new BadRequestException('User with this email already exists and is verified.');
      } else {
        this.logger.warn(`Attempt to register unverified email ${email}. Delegating OTP re-send.`);
        await this.otpService.sendOtp(user, OtpPurpose.REGISTRATION);
        return { message: 'User already exists but not verified. A new OTP has been sent to your email.' };
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
      throw new InternalServerErrorException('System error: Default role not found.');
    }

    await this.UserRolesRepository.create({
      user_id: user.id,
      role_id: assignedRole.id,
    });

    // Delega la generación, almacenamiento y envío del OTP al OtpService
    await this.otpService.sendOtp(user, OtpPurpose.REGISTRATION);

    return { message: 'Registration successful! Please check your email for the OTP verification code.' };
  }


  async signIn(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const { email, password } = loginUserDto;

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials'); // Mensaje genérico por seguridad
    }

    // ¡AÑADIR ESTA VERIFICACIÓN!
    if (!user.is_verified) {
      throw new UnauthorizedException('Please verify your email address before logging in. An OTP has been sent to your email.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Actualizar last_login_at
    // Asegúrate de que tu `usersRepository.update` funcione así, o usa `user.last_login_at = new Date(); await user.save();`
    await this.usersRepository.update(user.id, {
      last_login_at: new Date(),
    });

    // Recargar el usuario para asegurar que los roles están cargados (si no lo están ya por findByEmail)
    // Esto es importante si findByEmail no incluye los roles por defecto y los necesitas para el payload
    const userWithRoles = await this.usersRepository.findById(user.id);
    if (!userWithRoles) {
      throw new InternalServerErrorException('Failed to retrieve user data after login.');
    }

    const payload = {
      userCode: userWithRoles.code,
      email: userWithRoles.email,
      roles: userWithRoles.roles.map(role => role.rol),
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ accessToken: string }> {
    const { email, otp_code } = verifyOtpDto;

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Invalid email or OTP.');
    }

    if (user.is_verified) {
      throw new BadRequestException('User is already verified.');
    }

    const verifiedUser = await this.otpService.verifyOtp(user.id, otp_code, OtpPurpose.REGISTRATION);

    await this.usersRepository.update(verifiedUser.id, {
      is_verified: true,
      last_login_at: new Date(),
    });

    const userWithRoles = await this.usersRepository.findById(verifiedUser.id);
    if (!userWithRoles) {
      throw new InternalServerErrorException('Failed to retrieve user data after verification.');
    }

    const payload = {
      userCode: userWithRoles.code,
      email: userWithRoles.email,
      roles: userWithRoles.roles.map(r => r.rol),
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}