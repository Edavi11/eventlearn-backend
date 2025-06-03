import { ResponseModule } from '../../enums/response_module.enum';
import { ApiSuccessResponse, ApiErrorResponse } from './api-response.dto';

export class ResponseFactory {

  static createSuccessResponse(code: number, message: string, module: ResponseModule): ApiSuccessResponse<undefined> {
    return new ApiSuccessResponse(code, message, module);
  }

  static createSuccessResponseWithData<T>(code: number, message: string, module: ResponseModule, data: T): ApiSuccessResponse<T> {
    return new ApiSuccessResponse(code, message, module, data);
  }

  static createErrorResponse(code: number, message: string, module: ResponseModule): ApiErrorResponse<undefined> {
    return new ApiErrorResponse(code, message, module);
  }

  static createErrorResponseFormatted(code: number, messageTemplate: string, module: ResponseModule, ...args: any[]): ApiErrorResponse<undefined> {
    const message = messageTemplate.replace(/{(\d+)}/g, (match, number) => {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });

    return new ApiErrorResponse(code, message, module);
  }
  
}