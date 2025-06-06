import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from 'src/common/enums/user.role';

export class CreateAuthDto {

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'Confirm Password must be at least 8 characters long' })
    confirm_password: string;

    @IsNotEmpty()
    @IsString()
    first_name: string;

    @IsNotEmpty()
    @IsString()
    last_name: string;

    @IsEnum(UserRole, { message: 'Invalid role provided' })
    @IsNotEmpty()
    role: UserRole;
}
