import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Param,
  ParseIntPipe,
  Body,
  Req,
  Query,
} from '@nestjs/common';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.interface';
import { PostsService } from './posts.service';
import { PostResponseDto } from './dto/post-response.dto';
import { PostDetailResponseDto } from './dto/post-detail-response.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Public } from '../public/public.decorator';
import { AuthorizationService } from '../common/services/authorization.service';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { DEFAULT_PAGE, DEFAULT_PAGE_ITEMS } from '../constants';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  @Get()
  @Public()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('page_items', new ParseIntPipe({ optional: true })) pageItems?: number,
  ): Promise<PaginatedResponseDto<PostResponseDto>> {
    const finalPage = page || DEFAULT_PAGE;
    const finalPageItems = pageItems || DEFAULT_PAGE_ITEMS;
    
    const { postsDto, total } =
      await this.postsService.findAll(finalPage, finalPageItems);

    return new PaginatedResponseDto(postsDto, { page: finalPage, pageItems: finalPageItems, total });
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string): Promise<PostDetailResponseDto> {
    const post = await this.postsService.findById(id);
    return new PostDetailResponseDto(post);
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

  @Patch(':id/like')
  async addLike(@Param('id') id: string): Promise<PostResponseDto> {
    const post = await this.postsService.incrementLikes(id);
    return new PostResponseDto(post);
  }

  @Patch(':id/unlike')
  async removeLike(@Param('id') id: string): Promise<PostResponseDto> {
    const post = await this.postsService.decrementLikes(id);
    return new PostResponseDto(post);
  }
}
