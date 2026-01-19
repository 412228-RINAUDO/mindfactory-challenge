import { BadRequestException } from '@nestjs/common';

export class CannotRemoveLikeException extends BadRequestException {
  constructor() {
    super(
      { errorCode: 'CANNOT_REMOVE_LIKE' },
      { cause: 'Cannot remove like from a post with 0 likes' },
    );
  }
}
