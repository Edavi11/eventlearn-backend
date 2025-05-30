import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';


import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { RolesModule } from 'src/roles/roles.module';
import { UsersModule } from '../users/users.module'; // Necesitamos acceder al User model/service
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  exports: [AuthService, JwtModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    UsersModule,
    RolesModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), 
        signOptions: { expiresIn: '1h' }, 
      }),
      inject: [ConfigService],
    }),
    ConfigModule
  ]
})

export class AuthModule {}
