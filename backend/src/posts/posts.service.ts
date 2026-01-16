import { Inject, Injectable } from '@nestjs/common';
import type { IPostsRepository } from './posts.repository.interface';
import { POSTS_REPOSITORY } from './posts.tokens';
import { PostNotFoundException } from '../common/exceptions/post-not-found.exception';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

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

  async create(userId: string, data: CreatePostDto) {
    return this.postsRepository.create({
      ...data,
      userId,
    });
  }

  async update(postId: string, data: UpdatePostDto) {
    return this.postsRepository.update(postId, data);
  }
}
