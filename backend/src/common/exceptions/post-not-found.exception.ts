import { NotFoundException } from '@nestjs/common';

export class PostNotFoundException extends NotFoundException {
  constructor(postId: string) {
    super(
      { errorCode: 'POST_NOT_FOUND' },
      { cause: `Post with ID ${postId} not found` },
    );
  }
}
