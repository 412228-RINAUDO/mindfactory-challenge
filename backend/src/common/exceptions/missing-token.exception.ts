import { UnauthorizedException } from '@nestjs/common';

export class MissingTokenException extends UnauthorizedException {
  constructor() {
    super(
      { errorCode: 'MISSING_TOKEN' },
      { cause: 'Authorization token is missing' },
    );
  }
}
