import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable()
export class ApiResponse implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;
    return next.handle().pipe(
      map((data) => ({
        statusCode,
        message: statusCode >= 400 ? 'error' : 'success',
        error: statusCode >= 400 ? response.message : null,
        timestamp: Date.now(),
        version: '1.0.0',
        path: request.url,
        data,
      })),
      catchError((err) => {
        const statusCode = err instanceof HttpException ? err.getStatus() : 500;
        const errorResponse = {
          statusCode,
          message: err.message || 'Internal Server Error',
          error: err.name || 'Error',
          timestamp: Date.now(),
          version: '1.0.0',
          path: request.url,
          data: {},
        };
        return throwError(() => new HttpException(errorResponse, statusCode));
      }),
    );
  }
}
