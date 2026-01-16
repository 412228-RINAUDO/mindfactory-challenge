import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailAlreadyExistsException extends HttpException {
  constructor() {
    super(
    {
        errorCode: 'EMAIL_ALREADY_EXISTS',
        statusCode: HttpStatus.CONFLICT
    },
      HttpStatus.CONFLICT,
    );
  }
}
