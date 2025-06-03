// src/common/responses/api-response.dto.ts
import { ApiProperty } from '@nestjs/swagger'; // Para documentación OpenAPI

export class ApiResponse<T = undefined> {
  @ApiProperty({ description: 'Indica si la respuesta representa un error.', example: false })
  readonly error: boolean;

  @ApiProperty({ description: 'Código interno que describe el resultado de la operación.', example: 'AUTH_001' })
  readonly statusCode: number;

  @ApiProperty({ description: 'Mensaje descriptivo del resultado de la operación.', example: 'Operación exitosa.' })
  readonly message: string;

  @ApiProperty({ description: 'Módulo o sistema de origen del mensaje.', example: 'AUTH' })
  readonly module: string;

  @ApiProperty({ description: 'Datos asociados a la respuesta, si los hay.', required: false })
  readonly data?: T;

  constructor(error: boolean, code: number, message: string, module: string, data?: T) {
    this.error = error;
    this.statusCode = code;
    this.message = message;
    this.module = module;
    this.data = data;
  }
}

export class ApiSuccessResponse<T = undefined> extends ApiResponse<T> {
    constructor(code: number, message: string, module: string, data?: T) {
        super(false, code, message, module, data);
    }
}

export class ApiErrorResponse<T = undefined> extends ApiResponse<T> {
    constructor(code: number, message: string, module: string, data?: T) {
        super(true, code, message, module, data);
    }
}