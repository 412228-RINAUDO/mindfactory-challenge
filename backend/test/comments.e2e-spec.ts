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

  describe('POST /comments', () => {
    it('should create comment successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Test Comment',
          postId: postId,
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
        .post('/comments')
        .send({
          content: 'Test Comment',
          postId: postId,
        })
        .expect(401);
    });

    it('should fail without content', () => {
      return request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          postId: postId,
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toEqual(
            expect.arrayContaining([expect.stringContaining('content')]),
          );
        });
    });

    it('should fail without postId', () => {
      return request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Test Comment',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toEqual(
            expect.arrayContaining([expect.stringContaining('postId')]),
          );
        });
    });

    it('should fail with empty content', () => {
      return request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: '',
          postId: postId,
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toEqual(
            expect.arrayContaining([expect.stringContaining('content')]),
          );
        });
    });

    it('should fail with invalid postId', () => {
      return request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Test Comment',
          postId: 'invalid-uuid',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toEqual(
            expect.arrayContaining([expect.stringContaining('postId')]),
          );
        });
    });

    it('should fail when post does not exist', () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      return request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Test Comment',
          postId: nonExistentId,
        })
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('errorCode', 'POST_NOT_FOUND');
        });
    });
  });

  describe('GET /comments/post/:postId', () => {
    it('should get all comments for a post with user information', async () => {
      // Create a comment first
      await request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Test Comment',
          postId: postId,
        });

      const response = await request(app.getHttpServer())
        .get(`/comments/post/${postId}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('content', 'Test Comment');
      expect(response.body.data[0]).toHaveProperty('post_id', postId);
      expect(response.body.data[0]).toHaveProperty('user');
      expect(response.body.data[0].user).toHaveProperty('name', 'Test User');
      expect(response.body.data[0].user).not.toHaveProperty('password');
      expect(response.body.data[0]).toHaveProperty('created_at');

      // Check pagination meta
      expect(response.body.meta).toHaveProperty('page', 1);
      expect(response.body.meta).toHaveProperty('pageItems', 10);
      expect(response.body.meta).toHaveProperty('total', 1);
      expect(response.body.meta).toHaveProperty('totalPages', 1);
    });

    it('should return empty array when no comments exist', async () => {
      const response = await request(app.getHttpServer())
        .get(`/comments/post/${postId}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(0);
      expect(response.body.meta.total).toBe(0);
    });

    it('should return comments ordered by createdAt desc', async () => {
      // Create multiple comments
      await request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'First Comment', postId: postId });

      // Small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));

      await request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Second Comment', postId: postId });

      const response = await request(app.getHttpServer())
        .get(`/comments/post/${postId}`)
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].content).toBe('Second Comment');
      expect(response.body.data[1].content).toBe('First Comment');
    });

    it('should work without authentication (public endpoint)', async () => {
      await request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Test Comment',
          postId: postId,
        });

      const response = await request(app.getHttpServer())
        .get(`/comments/post/${postId}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
    });

    it('should fail when post does not exist', () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      return request(app.getHttpServer())
        .get(`/comments/post/${nonExistentId}`)
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('errorCode', 'POST_NOT_FOUND');
        });
    });

    it('should use default pagination values', async () => {
      await request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Test Comment', postId: postId });

      const response = await request(app.getHttpServer())
        .get(`/comments/post/${postId}`)
        .expect(200);

      expect(response.body.meta.page).toBe(1);
      expect(response.body.meta.pageItems).toBe(10);
    });

    it('should support custom pagination', async () => {
      // Create multiple comments
      for (let i = 0; i < 15; i++) {
        await request(app.getHttpServer())
          .post('/comments')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ content: `Comment ${i}`, postId: postId });
      }

      const response = await request(app.getHttpServer())
        .get(`/comments/post/${postId}?page=2&pageItems=5`)
        .expect(200);

      expect(response.body.data).toHaveLength(5);
      expect(response.body.meta.page).toBe(2);
      expect(response.body.meta.pageItems).toBe(5);
      expect(response.body.meta.total).toBe(15);
      expect(response.body.meta.totalPages).toBe(3);
    });
  });
});
