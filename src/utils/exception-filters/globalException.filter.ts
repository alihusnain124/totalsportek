import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred while processing your request. Please try again later.';
    let errors = null;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      errors = errorResponse['errors'];
      if (typeof errorResponse === 'string') {
        message = errorResponse;
      } else if (typeof errorResponse === 'object' && errorResponse['message']) {
        message = errorResponse['message'];
      }
    } else if (exception instanceof Error) {
      if (exception.name === 'QueryFailedError') {
        status = HttpStatus.BAD_REQUEST;
      } else if (exception.name === 'ValidationError') {
        status = HttpStatus.UNPROCESSABLE_ENTITY;
      }
      message = exception.message || 'Unexpected error occurred';
    }
    response.status(status).json({
      statusCode: status,
      message: message,
      errors,
    });
  }
}
