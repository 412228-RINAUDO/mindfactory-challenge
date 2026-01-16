import { UnauthorizedException } from '@nestjs/common';

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super(
      { errorCode: 'INVALID_CREDENTIALS' },
      { cause: 'Email or password is incorrect' },
    );
  }
}
