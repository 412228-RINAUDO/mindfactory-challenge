import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ICommentsRepository } from './comments.repository.interface';
import { CommentWithUser } from './dto/comment-response.dto';

@Injectable()
export class CommentsRepository implements ICommentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    content: string;
    userId: string;
    postId: string;
  }): Promise<CommentWithUser> {
    return this.prisma.comment.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
