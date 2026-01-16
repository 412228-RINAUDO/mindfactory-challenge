import { Inject, Injectable } from '@nestjs/common';
import type { IPostsRepository } from './posts.repository.interface';
import { POSTS_REPOSITORY } from './posts.tokens';

@Injectable()
export class PostsService {
  constructor(
    @Inject(POSTS_REPOSITORY)
    private readonly postsRepository: IPostsRepository,
  ) {}

  async findAll() {
    return this.postsRepository.findAll();
  }
}
