import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        const httpResponse = context.switchToHttp().getResponse();

        const statusCode = response?.statusCode || HttpStatus.OK;
        httpResponse.status(statusCode);

        const responseMessage = response?.message || 'Success.';
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message, status, ...rest } = response || {};
        const isEmpty = Object.keys(rest).length === 0;

        return {
          statusCode,
          message: responseMessage,
          data: isEmpty ? undefined : rest,
        };
      }),
    );
  }
}
