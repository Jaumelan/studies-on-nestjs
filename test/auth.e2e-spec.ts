import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/auth/signup (POST) signup request', async () => {
    const data = { email: 'name@mail.com', password: 'password' };
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(data)
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(data.email);
      });
  });

  it('/auth/signup (POST) signup request with an existing email', async () => {
    const data = { email: 'name@mail.com', password: 'password' };
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(data)
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(data.email);
      })
      .then(async () => {
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send(data)
          .expect(400)
          .then((res) => {
            expect(res.body.message).toEqual('Email already in use');
          });
      });
  });

  it('/auth/signin (POST) signin request', async () => {
    const data = { email: 'name@mail.com', password: 'password' };
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(data)
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(data.email);
      })
      .then(async () => {
        return request(app.getHttpServer())
          .post('/auth/signin')
          .send(data)
          .expect(201)
          .then((res) => {
            const { id, email } = res.body;
            expect(id).toBeDefined();
            expect(email).toEqual(data.email);
          });
      });
  });

  it('/auth/signin (POST) signin request with an invalid email', async () => {
    const data = { email: 'name@mail.com', password: 'password' };
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(data)
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(data.email);
      })
      .then(async () => {
        return request(app.getHttpServer())
          .post('/auth/signin')
          .send({ email: 'name1@mail.com', password: 'password' })
          .expect(404)
          .then((res) => {
            expect(res.body.message).toEqual('User not found');
          });
      });
  });

  it('/auth/whoissignedin (GET) whoisSignedIn request get the currently logged in user', async () => {
    const data = { email: 'name@mail.com', password: 'password' };

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(data)
      .expect(201);

    const cookie = response.headers['set-cookie'];

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoissignedin')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(data.email);
  });
});
