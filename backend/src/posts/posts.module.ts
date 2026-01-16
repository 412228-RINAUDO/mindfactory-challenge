import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { PostsController } from './posts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { POSTS_REPOSITORY } from './posts.tokens';

@Module({
  imports: [PrismaModule],
  controllers: [PostsController],
  providers: [
    PostsService,
    {
      provide: POSTS_REPOSITORY,
      useClass: PostsRepository,
    },
  ],
  exports: [PostsService],
})
export class PostsModule {}
