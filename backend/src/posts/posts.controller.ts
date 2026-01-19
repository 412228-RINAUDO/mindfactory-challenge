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
    @Req() req?: AuthenticatedRequest,
  ): Promise<PaginatedResponseDto<PostResponseDto>> {
    const finalPage = page || DEFAULT_PAGE;
    const finalPageItems = pageItems || DEFAULT_PAGE_ITEMS;
    const userId = req?.user?.sub;
    
    const { postsDto, total } =
      await this.postsService.findAll(finalPage, finalPageItems, userId);

    return new PaginatedResponseDto(postsDto, { page: finalPage, pageItems: finalPageItems, total });
  }

  @Get(':id')
  @Public()
  async findOne(
    @Param('id') id: string,
    @Req() req?: AuthenticatedRequest,
  ): Promise<PostDetailResponseDto> {
    const userId = req?.user?.sub;
    const post = await this.postsService.findById(id, userId);
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
  async addLike(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ message: string }> {
    await this.postsService.addLike(id, req.user.sub);
    return { message: 'Like added successfully' };
  }

  @Patch(':id/unlike')
  async removeLike(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ message: string }> {
    await this.postsService.removeLike(id, req.user.sub);
    return { message: 'Like removed successfully' };
  }
}
