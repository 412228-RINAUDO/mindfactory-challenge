import { Controller, Get, Post, Put, Param, Body, Req } from '@nestjs/common';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.interface';
import { PostsService } from './posts.service';
import { PostResponseDto } from './dto/post-response.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Public } from '../public/public.decorator';
import { AuthorizationService } from '../common/services/authorization.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  @Get()
  @Public()
  async findAll(): Promise<PostResponseDto[]> {
    const posts = await this.postsService.findAll();
    return posts.map(post => new PostResponseDto(post));
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string): Promise<PostResponseDto> {
    const post = await this.postsService.findById(id);
    return new PostResponseDto(post);
  }

  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<PostResponseDto> {
    const post = await this.postsService.create(req.user.sub, createPostDto);
    return new PostResponseDto(post);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<PostResponseDto> {
    const post = await this.postsService.findById(id);
    this.authorizationService.checkOwnership(req.user.sub, post.userId);

    const updatedPost = await this.postsService.update(id, updatePostDto);
    return new PostResponseDto(updatedPost);
  }
}