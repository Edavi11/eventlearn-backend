// src/common/exceptions/api.exception.ts (o donde prefieras)
import { HttpException } from '@nestjs/common';
import { ApiErrorResponse } from 'src/common/responses/structure/api-response.dto';

export class ApiException extends HttpException {
  constructor(errorResponse: ApiErrorResponse<any>) {
    super(errorResponse, errorResponse.statusCode);
  }
}