import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

import { Response } from 'express';
import { ApiErrorResponse } from '../responses/structure/api-response.dto';
import { ResponseModule } from '../enums/response_module.enum';
import { ResponseFactory } from '../responses/structure/response.factory';
import { BadResponse } from '../responses/bad_response';

@Catch(HttpException)
export class ApiExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        const exceptionResponse = exception.getResponse();

        if (status == HttpStatus.UNAUTHORIZED) {
            return response.status(status).json(BadResponse.TOKEN_NOT_PROVIDED_OR_NOT_ROLE_PERMITION)
        }

        const isValidationError = typeof exceptionResponse === 'object' && Array.isArray((exceptionResponse as any)?.message) && (exceptionResponse as any)?.error === 'Bad Request';

        if (isValidationError) {
            const messages = (exceptionResponse as any).message as string[];

            const validationFormatted: ApiErrorResponse = ResponseFactory.createErrorResponse(
                status,
                messages.join(' | '),
                ResponseModule.VALIDATION
            );

            return response.status(status).json(validationFormatted);
        }

        const errorResponse = exceptionResponse as unknown as ApiErrorResponse;

        response.status(errorResponse.statusCode).json({ ...errorResponse });
    }
}
