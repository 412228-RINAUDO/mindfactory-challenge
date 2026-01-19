import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IPostsRepository } from './posts.repository.interface';

@Injectable()
export class PostsRepository implements IPostsRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, pageItems: number) {
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
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.post.count(),
    ]);

    return { data, total };
  }

  async findById(id: string) {
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
          },
        },
      },
    });
  }

  async incrementLikes(id: string) {
    return this.prisma.post.update({
      where: { id },
      data: {
        likesCount: {
          increment: 1,
        },
      },
      include: { 
        user: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
  }

  async decrementLikes(id: string) {
    return this.prisma.post.update({
      where: { id },
      data: {
        likesCount: {
          decrement: 1,
        },
      },
      include: { 
        user: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
  }
}
