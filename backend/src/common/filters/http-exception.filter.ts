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
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const cause = exception.cause;
    const errorCode = this.getErrorCode(exception.getResponse());

    this.logger.error(JSON.stringify({
      statusCode: status,
      errorCode,
      cause,
    }));

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
    return 'UNKNOWN_ERROR';
  }
}
