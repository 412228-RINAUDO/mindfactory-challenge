import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { AuthGuard } from '../auth/auth.guard';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.interface';

@Controller('posts/:postId/comments')
@UseGuards(AuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(
    @Param('postId') postId: string,
    @Request() req: AuthenticatedRequest,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    return this.commentsService.create(req.user.sub, postId, createCommentDto);
  }
}
