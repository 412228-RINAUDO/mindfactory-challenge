import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { AuthGuard } from '../auth/auth.guard';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.interface';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { DEFAULT_PAGE, DEFAULT_PAGE_ITEMS } from '../constants';
import { Public } from '../public/public.decorator';

@Controller('posts/:postId/comments')
@UseGuards(AuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @Public()
  async findByPostId(
    @Param('postId') postId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('page_items', new ParseIntPipe({ optional: true })) pageItems?: number,
  ): Promise<PaginatedResponseDto<CommentResponseDto>> {
    const finalPage = page || DEFAULT_PAGE;
    const finalPageItems = pageItems || DEFAULT_PAGE_ITEMS;

    const { commentsDto, total } = await this.commentsService.findByPostId(
      postId,
      finalPage,
      finalPageItems,
    );

    return new PaginatedResponseDto(commentsDto, {
      page: finalPage,
      pageItems: finalPageItems,
      total,
    });
  }

  @Post()
  async create(
    @Param('postId') postId: string,
    @Request() req: AuthenticatedRequest,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    return this.commentsService.create(req.user.sub, postId, createCommentDto);
  }
}
