import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IPostsRepository } from './posts.repository.interface';

@Injectable()
export class PostsRepository implements IPostsRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, pageItems: number, userId?: string) {
    const skip = (page - 1) * pageItems;

    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take: pageItems,
        include: { 
          user: true,
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
          likes: userId ? {
            where: {
              userId,
            },
          } : false,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.post.count(),
    ]);

    return { data, total };
  }

  async findById(id: string, userId?: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: { 
        user: true,
        comments: {
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
        },
        _count: {
          select: {
            likes: true,
          },
        },
        likes: userId ? {
          where: {
            userId,
          },
        } : false,
      },
    });
  }

  async create(data: { title: string; content: string; userId: string }) {
    return this.prisma.post.create({
      data,
      include: { 
        user: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
  }

  async update(id: string, data: { title?: string; content?: string }) {
    return this.prisma.post.update({
      where: { id },
      data,
      include: { 
        user: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
  }

  async createLike(postId: string, userId: string) {
    return this.prisma.like.create({
      data: {
        postId,
        userId,
      },
    });
  }

  async deleteLike(postId: string, userId: string) {
    return this.prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
  }

  async findLike(postId: string, userId: string) {
    return this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
  }
}
