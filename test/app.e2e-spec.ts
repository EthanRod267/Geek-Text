import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
      // Mock admin user for all requests
      app.use((req, res, next) => {
        req.user = { role: 'admin' };
        next();
      });
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
    // Test POST /books
    it('POST /books - create a book', async () => {
      const book = {
        isbn: '1234567890',
        name: 'Test Book',
        description: 'A test book',
        price: 19.99,
        author: 'Test Author',
        genre: 'Fiction',
        publisher: 'Test Publisher',
        yearPublished: 2026,
        copiesSold: 100,
      };
      await request(app.getHttpServer())
        .post('/books')
        .send(book)
        .expect(201);
    });

    // Test GET /books/:isbn
    it('GET /books/:isbn - retrieve book by ISBN', async () => {
      const isbn = '1234567890';
      const response = await request(app.getHttpServer())
        .get(`/books/${isbn}`)
        .expect(200);
      expect(response.body).toMatchObject({
        isbn: '1234567890',
        name: 'Test Book',
        author: 'Test Author',
        genre: 'Fiction',
        publisher: 'Test Publisher',
        yearPublished: 2026,
        copiesSold: 100,
      });
    });

    // Test POST /authors
    it('POST /authors - create an author', async () => {
      const author = {
        firstName: 'John',
        lastName: 'Doe',
        biography: 'A test author',
        publisher: 'Test Publisher',
      };
      await request(app.getHttpServer())
        .post('/authors')
        .send(author)
        .expect(201);
    });
});
