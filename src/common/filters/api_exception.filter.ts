import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

import { Request, Response } from 'express';
import { ApiErrorResponse } from '../responses/structure/api-response.dto';
import { ResponseModule } from '../enums/response_module.enum';

@Catch(HttpException)
export class ApiExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        const exceptionResponse = exception.getResponse();
        const errorResponse = exceptionResponse as unknown as ApiErrorResponse;

        response.status(status).json({...errorResponse });
    }
}
