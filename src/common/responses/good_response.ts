import { HttpStatus } from "@nestjs/common";
import { ResponseModule } from "../enums/response_module.enum";
import { ApiResponse } from "./structure/api-response.dto";
import { ResponseFactory } from "./structure/response.factory";

export class GoodResponse {
    

    // GENERAL RESPONSES FOR ANY MODULE
    static readonly SUCCESSFUL_OPERATION = ResponseFactory.createSuccessResponse(
        HttpStatus.OK,
        'Operation successful.',
        ResponseModule.GENERAL
    );

    static readonly SUCCESSFUL_CONNECTION = ResponseFactory.createSuccessResponse(
        HttpStatus.OK,
        'Connection successfully established.',
        ResponseModule.GENERAL
    );

    static SUCCESSFUL_GET(data: any, module: ResponseModule): ApiResponse<any> {
        return ResponseFactory.createSuccessResponseWithData(
            HttpStatus.OK,
            'Data successfully obtained.',
            module,
            data ,
        );
    }

    static SUCCESSFUL_DELETION(module: ResponseModule): ApiResponse<any> {
        return ResponseFactory.createSuccessResponse(
            HttpStatus.OK,
            'Data successfully deleted.',
            module,
        );
    }

    static SUCCESSFUL_UPDATE(module: ResponseModule): ApiResponse<any> {
        return ResponseFactory.createSuccessResponse(
            HttpStatus.OK,
            'Data successfully updated.',
            module,
        );
    }

    static readonly SUCCESSFUL_CREATION = ResponseFactory.createSuccessResponse(
        HttpStatus.CREATED,
        'Data successfully created.',
        ResponseModule.GENERAL
    );

    // Auth Specific Success
    static readonly USER_CREATED_OTP_SENT = ResponseFactory.createSuccessResponse(
        HttpStatus.CREATED,
        'Registration successful! Please check your email for the OTP verification code.',
        ResponseModule.AUTH
    );

    static readonly USER_UNVERIFIED_OTP_RESENT = ResponseFactory.createSuccessResponse(
        HttpStatus.OK,
        'User already exists but not verified. A new OTP has been sent to your email.',
        ResponseModule.AUTH
    );

    static readonly RESET_PASSWORD_OTP_SENT = ResponseFactory.createSuccessResponse(
        HttpStatus.OK,
        'A reset password OTP has been sent to your email.',
        ResponseModule.AUTH
    );

    static readonly OTP_VERIFIED_SUCCESS = ResponseFactory.createSuccessResponse(
        HttpStatus.OK,
        'Otp verification successful! reset your password.',
        ResponseModule.AUTH
    );

    static readonly PASSWORD_RESET_SUCCESS = ResponseFactory.createSuccessResponse(
        HttpStatus.OK,
        'Password reset successful! You can now log in with your new password.',
        ResponseModule.AUTH
    );

    static FUNC_SIGNIN_SUCCESS(accessToken: string): ApiResponse<any> {
        return ResponseFactory.createSuccessResponseWithData(
            HttpStatus.OK,
            'Login successful.',
            ResponseModule.AUTH,
            accessToken ,
        );
    }

    static FUNC_OTP_VERIFIED_SUCCESS(accessToken: string): ApiResponse<any> {
        return ResponseFactory.createSuccessResponseWithData(
            HttpStatus.OK,
            'Email verification successful!',
            ResponseModule.AUTH,
            accessToken
        );
    }
}