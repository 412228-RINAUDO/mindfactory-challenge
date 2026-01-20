import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Posts (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let authToken: string;
  let userId: string;
  let anotherAuthToken: string;

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
    await prisma.like.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    // Create first user and get auth token
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

    // Create second user for testing forbidden scenarios
    const anotherResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Another User',
        email: 'another@example.com',
        password: 'password123',
      });

    anotherAuthToken = anotherResponse.body.access_token;
  });

  describe('GET /posts', () => {
    it('should get all posts with user information', async () => {
      // Create a post first
      await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Post',
          content: 'Test Content',
        });

      const response = await request(app.getHttpServer())
        .get('/posts')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('title', 'Test Post');
      expect(response.body.data[0]).toHaveProperty('content', 'Test Content');
      expect(response.body.data[0]).toHaveProperty('likes_count', 0);
      expect(response.body.data[0]).toHaveProperty('comments_count', 0);
      expect(response.body.data[0]).toHaveProperty('is_liked', false);
      expect(response.body.data[0]).toHaveProperty('user');
      expect(response.body.data[0].user).toHaveProperty('name', 'Test User');
      expect(response.body.data[0].user).toHaveProperty(
        'email',
        'test@example.com',
      );
      expect(response.body.data[0].user).not.toHaveProperty('password');
      expect(response.body.data[0]).toHaveProperty('created_at');
      expect(response.body.data[0]).not.toHaveProperty('comments');

      // Check pagination meta
      expect(response.body.meta).toHaveProperty('page', 1);
      expect(response.body.meta).toHaveProperty('pageItems', 10);
      expect(response.body.meta).toHaveProperty('total', 1);
      expect(response.body.meta).toHaveProperty('totalPages', 1);
    });

    it('should return empty array when no posts exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/posts')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(0);
      expect(response.body.meta.total).toBe(0);
    });

    it('should return posts ordered by createdAt desc', async () => {
      // Create multiple posts
      await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'First Post', content: 'First Content' });

      // Small delay to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 10));

      await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Second Post', content: 'Second Content' });

      const response = await request(app.getHttpServer())
        .get('/posts')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].title).toBe('Second Post');
      expect(response.body.data[1].title).toBe('First Post');
    });

    it('should use default pagination values', async () => {
      await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Post', content: 'Test Content' });

      const response = await request(app.getHttpServer())
        .get('/posts')
        .expect(200);

      expect(response.body.meta.page).toBe(1);
      expect(response.body.meta.pageItems).toBe(10);
    });
  });

  describe('GET /posts/:id', () => {
    it('should get post by id with user information', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Post',
          content: 'Test Content',
        });

      const postId = createResponse.body.id;

      // Create a comment
      await request(app.getHttpServer())
        .post(`/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Test Comment',
        });

      // Add a like
      await request(app.getHttpServer())
        .patch(`/posts/${postId}/like`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const response = await request(app.getHttpServer())
        .get(`/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', postId);
      expect(response.body).toHaveProperty('title', 'Test Post');
      expect(response.body).toHaveProperty('content', 'Test Content');
      expect(response.body).toHaveProperty('likes_count', 1);
      expect(response.body).toHaveProperty('comments_count', 1);
      expect(response.body).toHaveProperty('is_liked', true);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('name', 'Test User');
      expect(response.body.user).not.toHaveProperty('password');
      
      // Verify comments are NOT included in post detail
      expect(response.body).not.toHaveProperty('comments');
    });

    it('should fail when post does not exist', () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      return request(app.getHttpServer())
        .get(`/posts/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('POST /posts', () => {
    it('should create post successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'New Post',
          content: 'New Content',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', 'New Post');
      expect(response.body).toHaveProperty('content', 'New Content');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id', userId);
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .post('/posts')
        .send({
          title: 'New Post',
          content: 'New Content',
        })
        .expect(401);
    });

    it('should fail without title', () => {
      return request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'New Content',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toEqual(
            expect.arrayContaining([expect.stringContaining('title')]),
          );
        });
    });

    it('should fail without content', () => {
      return request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'New Post',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toEqual(
            expect.arrayContaining([expect.stringContaining('content')]),
          );
        });
    });

    it('should fail with empty title', () => {
      return request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '',
          content: 'New Content',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toEqual(
            expect.arrayContaining([expect.stringContaining('title')]),
          );
        });
    });

    it('should fail with empty content', () => {
      return request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'New Post',
          content: '',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toEqual(
            expect.arrayContaining([expect.stringContaining('content')]),
          );
        });
    });

    it('should fail when user does not exist', async () => {
      // Delete the user to simulate non-existent user
      await prisma.user.delete({ where: { id: userId } });

      return request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'New Post',
          content: 'New Content',
        })
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('errorCode', 'USER_NOT_FOUND');
        });
    });
  });

  describe('PUT /posts/:id', () => {
    it('should update own post successfully', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Original Title',
          content: 'Original Content',
        });

      const postId = createResponse.body.id;

      const response = await request(app.getHttpServer())
        .put(`/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Title',
          content: 'Updated Content',
        })
        .expect(200);

      expect(response.body).toHaveProperty('id', postId);
      expect(response.body).toHaveProperty('title', 'Updated Title');
      expect(response.body).toHaveProperty('content', 'Updated Content');
    });

    it("should fail when updating another user's post", async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Original Title',
          content: 'Original Content',
        });

      const postId = createResponse.body.id;

      return request(app.getHttpServer())
        .put(`/posts/${postId}`)
        .set('Authorization', `Bearer ${anotherAuthToken}`)
        .send({
          title: 'Updated Title',
          content: 'Updated Content',
        })
        .expect(403);
    });

    it('should fail without authentication', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Original Title',
          content: 'Original Content',
        });

      const postId = createResponse.body.id;

      return request(app.getHttpServer())
        .put(`/posts/${postId}`)
        .send({
          title: 'Updated Title',
          content: 'Updated Content',
        })
        .expect(401);
    });

    it('should fail when post does not exist', () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      return request(app.getHttpServer())
        .put(`/posts/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Title',
          content: 'Updated Content',
        })
        .expect(404);
    });

    it('should fail with empty title', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Original Title',
          content: 'Original Content',
        });

      const postId = createResponse.body.id;

      return request(app.getHttpServer())
        .put(`/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toEqual(
            expect.arrayContaining([expect.stringContaining('title')]),
          );
        });
    });

    it('should fail with empty content', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Original Title',
          content: 'Original Content',
        });

      const postId = createResponse.body.id;

      return request(app.getHttpServer())
        .put(`/posts/${postId}`)
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

    it('should fail when post does not exist for update', () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      return request(app.getHttpServer())
        .put(`/posts/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Title',
          content: 'Updated Content',
        })
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('errorCode', 'POST_NOT_FOUND');
        });
    });
  });
  describe('PATCH /posts/:id/like', () => {
    it('should add like successfully', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Post',
          content: 'Test Content',
        });

      const postId = createResponse.body.id;

      const response = await request(app.getHttpServer())
        .patch(`/posts/${postId}/like`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Like added successfully');

      // Verify the like was added (must include auth token to see is_liked)
      const getResponse = await request(app.getHttpServer())
        .get('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(getResponse.body.data[0].likes_count).toBe(1);
      expect(getResponse.body.data[0].is_liked).toBe(true);
    });

    it('should be idempotent when liking twice', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Post',
          content: 'Test Content',
        });

      const postId = createResponse.body.id;

      await request(app.getHttpServer())
        .patch(`/posts/${postId}/like`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      await request(app.getHttpServer())
        .patch(`/posts/${postId}/like`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify only one like exists
      const getResponse = await request(app.getHttpServer())
        .get('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(getResponse.body.data[0].likes_count).toBe(1);
    });

    it('should track likes per user', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Post',
          content: 'Test Content',
        });

      const postId = createResponse.body.id;

      // First user likes
      await request(app.getHttpServer())
        .patch(`/posts/${postId}/like`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Second user likes
      await request(app.getHttpServer())
        .patch(`/posts/${postId}/like`)
        .set('Authorization', `Bearer ${anotherAuthToken}`)
        .expect(200);

      // Verify first user sees is_liked = true
      const firstUserResponse = await request(app.getHttpServer())
        .get('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(firstUserResponse.body.data[0].likes_count).toBe(2);
      expect(firstUserResponse.body.data[0].is_liked).toBe(true);

      // Verify second user sees is_liked = true
      const secondUserResponse = await request(app.getHttpServer())
        .get('/posts')
        .set('Authorization', `Bearer ${anotherAuthToken}`)
        .expect(200);

      expect(secondUserResponse.body.data[0].likes_count).toBe(2);
      expect(secondUserResponse.body.data[0].is_liked).toBe(true);
    });

    it('should fail when post does not exist', () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      return request(app.getHttpServer())
        .patch(`/posts/${nonExistentId}/like`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should fail without authentication', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Post',
          content: 'Test Content',
        });

      const postId = createResponse.body.id;

      return request(app.getHttpServer())
        .patch(`/posts/${postId}/like`)
        .expect(401);
    });
  });

  describe('PATCH /posts/:id/unlike', () => {
    it('should remove like successfully', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Post',
          content: 'Test Content',
        });

      const postId = createResponse.body.id;

      // Add a like first
      await request(app.getHttpServer())
        .patch(`/posts/${postId}/like`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const response = await request(app.getHttpServer())
        .patch(`/posts/${postId}/unlike`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Like removed successfully');

      // Verify the like was removed
      const getResponse = await request(app.getHttpServer())
        .get('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(getResponse.body.data[0].likes_count).toBe(0);
      expect(getResponse.body.data[0].is_liked).toBe(false);
    });

    it('should fail when trying to unlike without having liked', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Post',
          content: 'Test Content',
        });

      const postId = createResponse.body.id;

      return request(app.getHttpServer())
        .patch(`/posts/${postId}/unlike`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('errorCode', 'CANNOT_REMOVE_LIKE');
        });
    });

    it('should only remove like for the authenticated user', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Post',
          content: 'Test Content',
        });

      const postId = createResponse.body.id;

      // Both users like the post
      await request(app.getHttpServer())
        .patch(`/posts/${postId}/like`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      await request(app.getHttpServer())
        .patch(`/posts/${postId}/like`)
        .set('Authorization', `Bearer ${anotherAuthToken}`)
        .expect(200);

      // First user unlikes
      await request(app.getHttpServer())
        .patch(`/posts/${postId}/unlike`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify first user sees is_liked = false, but total is still 1
      const firstUserResponse = await request(app.getHttpServer())
        .get('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(firstUserResponse.body.data[0].likes_count).toBe(1);
      expect(firstUserResponse.body.data[0].is_liked).toBe(false);

      // Verify second user still sees is_liked = true
      const secondUserResponse = await request(app.getHttpServer())
        .get('/posts')
        .set('Authorization', `Bearer ${anotherAuthToken}`)
        .expect(200);

      expect(secondUserResponse.body.data[0].likes_count).toBe(1);
      expect(secondUserResponse.body.data[0].is_liked).toBe(true);
    });

    it('should fail when post does not exist', () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      return request(app.getHttpServer())
        .patch(`/posts/${nonExistentId}/unlike`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should fail without authentication', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Post',
          content: 'Test Content',
        });

      const postId = createResponse.body.id;

      // Add a like first
      await request(app.getHttpServer())
        .patch(`/posts/${postId}/like`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      return request(app.getHttpServer())
        .patch(`/posts/${postId}/unlike`)
        .expect(401);
    });
  });
});
