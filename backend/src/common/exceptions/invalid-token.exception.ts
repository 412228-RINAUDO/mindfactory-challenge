import { UnauthorizedException } from '@nestjs/common';

export class InvalidTokenException extends UnauthorizedException {
  constructor() {
    super(
      { errorCode: 'INVALID_TOKEN' },
      { cause: 'Authorization token is invalid or expired' },
    );
  }
}
