import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Comments (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let authToken: string;
  let userId: string;
  let postId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean up database before each test
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    // Create user and get auth token
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    authToken = response.body.access_token;
    const payload = JSON.parse(
      Buffer.from(authToken.split('.')[1], 'base64').toString(),
    );
    userId = payload.sub;

    // Create a post for testing comments
    const postResponse = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Post',
        content: 'Test Content',
      });

    postId = postResponse.body.id;
  });

  describe('POST /posts/:postId/comments', () => {
    it('should create comment successfully', async () => {
      const response = await request(app.getHttpServer())
        .post(`/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Test Comment',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('content', 'Test Comment');
      expect(response.body).toHaveProperty('post_id', postId);
      expect(response.body).toHaveProperty('created_at');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id', userId);
      expect(response.body.user).toHaveProperty('name', 'Test User');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .post(`/posts/${postId}/comments`)
        .send({
          content: 'Test Comment',
        })
        .expect(401);
    });

    it('should fail without content', () => {
      return request(app.getHttpServer())
        .post(`/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toEqual(
            expect.arrayContaining([expect.stringContaining('content')]),
          );
        });
    });

    it('should fail with empty content', () => {
      return request(app.getHttpServer())
        .post(`/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: '',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toEqual(
            expect.arrayContaining([expect.stringContaining('content')]),
          );
        });
    });

    it('should fail when post does not exist', () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      return request(app.getHttpServer())
        .post(`/posts/${nonExistentId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Test Comment',
        })
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('errorCode', 'POST_NOT_FOUND');
        });
    });
  });
});
