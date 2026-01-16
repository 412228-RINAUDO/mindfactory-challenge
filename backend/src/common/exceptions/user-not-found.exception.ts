import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(userId: string) {
    super(
      { errorCode: 'USER_NOT_FOUND' },
      { cause: `User with ID ${userId} not found` },
    );
  }
}
