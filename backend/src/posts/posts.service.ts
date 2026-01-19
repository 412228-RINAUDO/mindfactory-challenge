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

  async findAll(page: number, pageItems: number, userId?: string) {
    const { data, total } = await this.postsRepository.findAll(page, pageItems, userId);

    const postsDto = data.map((post) => new PostResponseDto(post));

    return { postsDto, total };
  }

  async findById(id: string, userId?: string) {
    const post = await this.postsRepository.findById(id, userId);

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

  async addLike(postId: string, userId: string) {
    await this.findById(postId);
    await this.usersService.findById(userId);
    
    const existingLike = await this.postsRepository.findLike(postId, userId);
    if (existingLike) {
      return existingLike;
    }
    
    return this.postsRepository.createLike(postId, userId);
  }

  async removeLike(postId: string, userId: string) {
    await this.findById(postId);
    
    const existingLike = await this.postsRepository.findLike(postId, userId);
    if (!existingLike) {
      throw new CannotRemoveLikeException();
    }
    
    return this.postsRepository.deleteLike(postId, userId);
  }
}
