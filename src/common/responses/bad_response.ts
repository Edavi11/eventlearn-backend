import { HttpStatus } from "@nestjs/common";
import { ResponseModule } from "../enums/response_module.enum";
import { ResponseFactory } from "./structure/response.factory";
import { Entities } from "../enums/entities";
import { ApiErrorResponse } from "./structure/api-response.dto";

export class BadResponse {

    static readonly UNEXPECTED_ERROR = ResponseFactory.createErrorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'An unexpected error has occurred.',
        ResponseModule.GENERAL
    );

    static readonly ACCESS_MISSING_DATA = ResponseFactory.createErrorResponse(
        HttpStatus.BAD_REQUEST,
        'You did not provide the necessary data to access.',
        ResponseModule.GENERAL
    );

    static readonly UNAUTHORIZED_ACCESS = ResponseFactory.createErrorResponse(
        HttpStatus.UNAUTHORIZED,
        'You do not have the necessary permissions to access this action.',
        ResponseModule.GENERAL
    );

    static readonly ENTITY_NOT_FOUND = ResponseFactory.createErrorResponse(
        HttpStatus.NOT_FOUND,
        'The indicated entity does not exist.',
        ResponseModule.GENERAL
    );

    static readonly INVALID_OTP = ResponseFactory.createErrorResponse(
        HttpStatus.NOT_FOUND,
        'The provided OTP is invalid or has expired.',
        ResponseModule.AUTH
    );

    static FUNC_ENTITY_NOT_FOUND(entity: Entities): ApiErrorResponse<any> {
        return ResponseFactory.createErrorResponse(
            HttpStatus.NOT_FOUND,
            `The entity ${entity} does not exist.`,
            ResponseModule.GENERAL,
        );
    }

    static readonly ASSOCIATED_ENTITY_NOT_FOUND = ResponseFactory.createErrorResponse(
        HttpStatus.NOT_FOUND,
        'Some associated entity is not valid.',
        ResponseModule.GENERAL
    );

    static FUNC_ASSOCIATED_ENTITY_NOT_FOUND(entity: Entities): ApiErrorResponse<any> {
        return ResponseFactory.createErrorResponse(
            HttpStatus.NOT_FOUND,
            `The associated entity ${entity} does not exist.`,
            ResponseModule.GENERAL,
        );
    }

    static readonly UNIQUE_DATA_IN_USE = ResponseFactory.createErrorResponse(
        HttpStatus.BAD_REQUEST,
        'Any unique property is already in use by another entity.',
        ResponseModule.GENERAL
    );

    static readonly USER_ALREADY_EXISTS = ResponseFactory.createErrorResponse(
        HttpStatus.BAD_REQUEST,
        'The user already exists in the system.',
        ResponseModule.AUTH
    );

    static readonly USER_NOT_EXISTS = ResponseFactory.createErrorResponse(
        HttpStatus.BAD_REQUEST,
        'The user does not exist in the system.',
        ResponseModule.AUTH
    );

    static readonly USER_NOT_VERIFY = ResponseFactory.createErrorResponse(
        HttpStatus.BAD_REQUEST,
        'The user is not verified. Please check your email for the OTP verification code.',
        ResponseModule.AUTH
    );

    static readonly USER_PASSWORD_IS_INVALID = ResponseFactory.createErrorResponse(
        HttpStatus.BAD_REQUEST,
        'The provided password is invalid.',
        ResponseModule.AUTH
    );
    
    static readonly OTP_EMAIL_SEND_FAILED = ResponseFactory.createErrorResponse(
        HttpStatus.BAD_REQUEST,
        'Failed to send OTP email. Please try again later.',
        ResponseModule.AUTH
    );

    static readonly USER_CREATION_FAILED = ResponseFactory.createErrorResponse(
        HttpStatus.BAD_REQUEST,
        'User creation failed. Please check the provided data.',
        ResponseModule.AUTH
    );

    static readonly PASSWORDS_DO_NOT_MATCH = ResponseFactory.createErrorResponse(
        HttpStatus.BAD_REQUEST,
        'The provided passwords do not match.',
        ResponseModule.AUTH
    );
    
    static readonly PASSWORD_RESET_UNAUTHORIZED = ResponseFactory.createErrorResponse(
        HttpStatus.BAD_REQUEST,
        'You are not authorized to reset the password.',
        ResponseModule.AUTH
    );
}