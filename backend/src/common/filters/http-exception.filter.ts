import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const errorCode = this.getErrorCode(exceptionResponse);
    const validationErrors = this.getValidationErrors(exceptionResponse);

    this.logger.error({
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      statusCode: status,
      errorCode,
      cause: exception.cause,
      ...(validationErrors && { validationErrors }),
    });

    response.status(status).json({
      statusCode: status,
      errorCode,
    });
  }

  private getErrorCode(response: string | object): string {
    if (
      typeof response === 'object' &&
      response !== null &&
      'errorCode' in response
    ) {
      return response.errorCode as string;
    }

    if (
      typeof response === 'object' &&
      response !== null &&
      'message' in response &&
      Array.isArray(response.message)
    ) {
      return 'VALIDATION_ERROR';
    }

    return 'UNKNOWN_ERROR';
  }

  private getValidationErrors(response: string | object): string[] | null {
    if (
      typeof response === 'object' &&
      response !== null &&
      'message' in response &&
      Array.isArray(response.message)
    ) {
      return response.message;
    }
    return null;
  }
}
