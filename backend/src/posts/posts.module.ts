import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { PostsController } from './posts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { POSTS_REPOSITORY } from './posts.tokens';
import { AuthorizationService } from '../common/services/authorization.service';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [PostsController],
  providers: [
    PostsService,
    AuthorizationService,
    {
      provide: POSTS_REPOSITORY,
      useClass: PostsRepository,
    },
  ],
  exports: [PostsService],
})
export class PostsModule {}
