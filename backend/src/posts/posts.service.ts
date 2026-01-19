import { Inject, Injectable } from '@nestjs/common';
import type { IPostsRepository } from './posts.repository.interface';
import { POSTS_REPOSITORY } from './posts.tokens';
import { PostNotFoundException } from '../common/exceptions/post-not-found.exception';
import { CannotRemoveLikeException } from '../common/exceptions/cannot-remove-like.exception';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @Inject(POSTS_REPOSITORY)
    private readonly postsRepository: IPostsRepository,
    private readonly usersService: UsersService,
  ) {}

  async findAll(page: number, pageItems: number) {
    const { data, total } = await this.postsRepository.findAll(page, pageItems);

    const postsDto = data.map((post) => new PostResponseDto(post));

    return { postsDto, total };
  }

  async findById(id: string) {
    const post = await this.postsRepository.findById(id);

    if (!post) {
      throw new PostNotFoundException(id);
    }

    return post;
  }

  async create(userId: string, data: CreatePostDto) {
    await this.usersService.findById(userId);
    
    return this.postsRepository.create({
      ...data,
      userId,
    });
  }

  async update(postId: string, data: UpdatePostDto) {
    await this.findById(postId);
    
    return this.postsRepository.update(postId, data);
  }

  async incrementLikes(postId: string) {
    await this.findById(postId);
    return this.postsRepository.incrementLikes(postId);
  }

  async decrementLikes(postId: string) {
    const post = await this.findById(postId);
    
    if (post.likesCount === 0) {
      throw new CannotRemoveLikeException();
    }
    
    return this.postsRepository.decrementLikes(postId);
  }
}
