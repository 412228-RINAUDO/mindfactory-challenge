import { Inject, Injectable } from '@nestjs/common';
import type { IPostsRepository } from './posts.repository.interface';
import { POSTS_REPOSITORY } from './posts.tokens';
import { PostNotFoundException } from '../common/exceptions/post-not-found.exception';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, User } from '../../generated/prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';
import { DEFAULT_PAGE, DEFAULT_PAGE_ITEMS } from '../constants';
import { PostResponseDto } from './dto/post-response.dto';

@Injectable()
export class PostsService {
  constructor(
    @Inject(POSTS_REPOSITORY)
    private readonly postsRepository: IPostsRepository,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { page = DEFAULT_PAGE, pageItems = DEFAULT_PAGE_ITEMS } =
      paginationDto;

    const { data, total } = await this.postsRepository.findAll(page, pageItems);

    const postsDto = data.map((post) => new PostResponseDto(post));

    return { postsDto, total, page, pageItems };
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
