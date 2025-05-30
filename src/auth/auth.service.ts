// Imports
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

// NestJS
import { InjectModel } from '@nestjs/sequelize';
import { BadRequestException, Injectable, UnauthorizedException, Logger } from '@nestjs/common';

// DTOs
import { LoginUserDto } from './dto/login-auth.dto';
import { CreateAuthDto } from './dto/create-auth.dto';


// Repositories
import { UsersRepository } from 'src/users/repository/users.repository';
import { RolesRepository } from 'src/roles/repository/roles.repository';
import { UserRolesRepository } from 'src/roles/repository/user_roles.repository';

@Injectable()
export class AuthService {

  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesRepository: RolesRepository,
    private readonly UserRolesRepository: UserRolesRepository,
    private jwtService: JwtService,
  ) {}


  async signUp(createAuthDto: CreateAuthDto): Promise<{ accessToken: string }> {
    const { email, password, first_name, last_name, role } = createAuthDto;

    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.usersRepository.create({
      email,
      password: hashedPassword,
      name: `${first_name} ${last_name}`,
    });

    const assignedRole = await this.rolesRepository.findByRol(role); 
    if (!assignedRole) {
      this.logger.error(`Role '${role}' not found in database. Please ensure seed is run.`);
      throw new BadRequestException('System error: Default role not found.');
    }

    await this.UserRolesRepository.create({
      user_id: newUser.id,
      role_id: assignedRole.id,
    });

    newUser.roles = [assignedRole];

    const payload = {
      userCode: newUser.code,
      email: newUser.email,
      roles: newUser.roles.map(r => r.rol),
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }


  async signIn(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const { email, password } = loginUserDto;

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Comparar contraseñas
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.last_login_at = new Date();
    await user.save();

    const payload = {
      userCode: user.code,
      email: user.email,
      roles: user.roles.map(role => role.rol),
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}