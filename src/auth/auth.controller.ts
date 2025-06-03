import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginUserDto } from './dto/login-auth.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ApiResponse } from 'src/common/responses/structure/api-response.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('signup')
    async signUp(@Body() dto: CreateAuthDto): Promise<ApiResponse<any>> {
    return await this.authService.signUp(dto);
  }

  @Post('signin')
  async signIn(@Body() loginUserDto: LoginUserDto): Promise<ApiResponse<any>> {
    return this.authService.signIn(loginUserDto);
  }
  
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK) // Código de estado 200 para verificación exitosa
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<ApiResponse<any>>  {
    return this.authService.verifyOtp(verifyOtpDto);
  }
}
