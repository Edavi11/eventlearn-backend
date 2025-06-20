import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

// Models
import { User } from '../../users/entities/user.model';

// Interfaces
import { JwtPayload } from '../interface/jwt.paylod.interface';

// Repositories
import { UsersRepository } from 'src/users/repository/users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

  constructor( private configService: ConfigService, private usersRepository: UsersRepository ) {

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      ignoreExpiration: false,   
      algorithms: ['HS256'],
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User & { currentRole: string }> {
    const user = await this.usersRepository.findByCode(payload.userCode); 

    if (!user || user.code !== payload.userCode || !user.is_active) {
      throw new UnauthorizedException('Token validation failed, user not found, or user is inactive');
    }

    return Object.assign(user, { currentRole: payload.currentRole });
  }
}