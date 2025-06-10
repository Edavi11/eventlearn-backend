import { Body, Controller, Post, Req } from '@nestjs/common';

import { AuthService } from './auth.service';

// DTOs
import { ApiResponse } from 'src/common/responses/structure/api-response.dto';
import { CreateAuthDto, LoginUserDto, VerifyOtpDto, ForgotPasswordDto , VerifyResetOtpDto , ResetPasswordDto} from './dto/dtos';
import { Auth } from './decorators/auth.decorator';
import { SelectRoleDto } from './dto/select-role.dto';

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

  @Post('select-role')
  @Auth()
  async selectRole(@Body() selectRoleDto: SelectRoleDto, @Req() req: any): Promise<ApiResponse<any>> {
    return this.authService.selectRole(selectRoleDto, req.user);
  }
  
  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<ApiResponse<any>>  {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPassDto: ForgotPasswordDto): Promise<ApiResponse<any>>  {
    return this.authService.forgotPassword(forgotPassDto);
  }
  
  @Post('verify-reset-otp')
  async verifyResetOtp(@Body() verifyResetOtpDto: VerifyResetOtpDto): Promise<ApiResponse<any>>  {
    return this.authService.verifyResetOtp(verifyResetOtpDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<ApiResponse<any>>  {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
