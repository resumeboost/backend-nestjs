import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from '../src/app.module';

import { UserModule } from '../src/user/user.module';
import { UserService } from '../src/user/user.service';


import {MongoMemoryServer} from "mongodb-memory-server";
import { MongooseModule } from '@nestjs/mongoose';

import {removeAllCollections} from "./db-handler.utils";

// this is a single test, rather than each it
// this is because the database is persistent
// throughout the test
describe('AppController (e2e)', () => {
  //let app: INestApplication;
  //let userService = {

  //}
  let app: INestApplication;
  let mongo: MongoMemoryServer;
  beforeAll(async() => {

    // set up the in-memory mongodb
    process.env.JWT_SECRET_KEY = "abc";  
    mongo = new MongoMemoryServer();
    const mongoURI = await mongo.getUri();
    process.env.MONGODB_URI = mongoURI;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableShutdownHooks();
    await app.init();
  });

  beforeEach(async () => {
    // nothing as of now
  });

  afterEach(async () => {
    // nothing as of now
  });

  afterAll(async() => {
    await app.close();
    await mongo.stop();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('should be defined', async () => {
    expect(mongo).toBeDefined();
    expect(process.env.MONGODB_URI).toBe(await mongo.getUri());
  });

  it('app should be defined', async () => {
    expect(app).toBeDefined();
  });
});