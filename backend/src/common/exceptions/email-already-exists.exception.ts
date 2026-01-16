import { ConflictException } from '@nestjs/common';

export class EmailAlreadyExistsException extends ConflictException {
  constructor() {
    super(
      { errorCode: 'EMAIL_ALREADY_EXISTS' },
      { cause: 'Email address is already registered' },
    );
  }
}
