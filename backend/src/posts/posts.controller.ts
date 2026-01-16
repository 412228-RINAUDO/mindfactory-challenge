import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Req,
  Query,
} from '@nestjs/common';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.interface';
import { PostsService } from './posts.service';
import { PostResponseDto } from './dto/post-response.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Public } from '../public/public.decorator';
import { AuthorizationService } from '../common/services/authorization.service';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  @Get()
  @Public()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<PostResponseDto>> {
    const { postsDto, total, page, pageItems } =
      await this.postsService.findAll(paginationDto);

    return new PaginatedResponseDto(postsDto, { page, pageItems, total });
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
