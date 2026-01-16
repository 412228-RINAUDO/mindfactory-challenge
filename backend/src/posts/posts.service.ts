import { Inject, Injectable } from '@nestjs/common';
import type { IPostsRepository } from './posts.repository.interface';
import { POSTS_REPOSITORY } from './posts.tokens';
import { PostNotFoundException } from '../common/exceptions/post-not-found.exception';

@Injectable()
export class PostsService {
  constructor(
    @Inject(POSTS_REPOSITORY)
    private readonly postsRepository: IPostsRepository,
  ) {}

  async findAll() {
    return this.postsRepository.findAll();
  }

  async findById(id: string) {
    const post = await this.postsRepository.findById(id);

    if (!post) {
      throw new PostNotFoundException(id);
    }

    return post;
  }
}
