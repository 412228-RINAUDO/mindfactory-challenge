import { ForbiddenException as NestForbiddenException } from '@nestjs/common';

export class ForbiddenException extends NestForbiddenException {
  constructor() {
    super(
      { errorCode: 'FORBIDDEN' },
      { cause: 'You do not have permission to access this resource' },
    );
  }
}
