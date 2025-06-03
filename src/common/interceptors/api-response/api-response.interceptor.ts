import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        // Si incluye un statusCode, lo usamos
        const status = data?.statusCode ?? 200;

        // Remueve statusCode del body si no quieres exponerlo
        // if ('statusCode' in data) {
        //   delete data.statusCode;
        // }

        return response.status(status).json(data);
      }),
    );
  }
}
