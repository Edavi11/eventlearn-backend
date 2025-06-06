import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(12)
  new_password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(12)
  confirm_password: string;
}