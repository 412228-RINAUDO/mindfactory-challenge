import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ICommentsRepository } from './comments.repository.interface';
import { CommentWithUser } from './dto/comment-response.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsRepository implements ICommentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCommentDto & { userId: string }): Promise<CommentWithUser> {
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

  async findByPostId(postId: string, page: number, pageItems: number) {
    const skip = (page - 1) * pageItems;

    const [data, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { postId },
        skip,
        take: pageItems,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.comment.count({
        where: { postId },
      }),
    ]);

    return { data, total };
  }
}
