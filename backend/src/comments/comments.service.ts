import { Inject, Injectable } from '@nestjs/common';
import type { ICommentsRepository } from './comments.repository.interface';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PostsService } from '../posts/posts.service';
import { COMMENTS_REPOSITORY } from './comments.tokens';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(COMMENTS_REPOSITORY)
    private readonly commentsRepository: ICommentsRepository,
    private readonly postsService: PostsService,
  ) {}

  async create(
    userId: string,
    postId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    await this.postsService.findById(postId);

    const comment = await this.commentsRepository.create({
      content: createCommentDto.content,
      userId,
      postId,
    });

    return new CommentResponseDto(comment);
  }

  async findByPostId(postId: string, page: number, pageItems: number) {
    await this.postsService.findById(postId);

    const { data, total } = await this.commentsRepository.findByPostId(
      postId,
      page,
      pageItems,
    );

    const commentsDto = data.map((comment) => new CommentResponseDto(comment));

    return { commentsDto, total };
  }
}
