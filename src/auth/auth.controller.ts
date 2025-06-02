import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginUserDto } from './dto/login-auth.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('signup')
  @HttpCode(HttpStatus.CREATED) // Código de estado 201 para creación exitosa (usuario creado, OTP enviado)
  async signUp(@Body() createAuthDto: CreateAuthDto): Promise<{ message: string }> {
    return this.authService.signUp(createAuthDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK) // Código de estado 200 para login exitoso
  async signIn(@Body() loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(loginUserDto);
  }
  
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK) // Código de estado 200 para verificación exitosa
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<{ accessToken: string }> {
    return this.authService.verifyOtp(verifyOtpDto);
  }
}
