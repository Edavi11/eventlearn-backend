import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class VerifyResetOtpDto {

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(6)
  otp_code: string;
}
