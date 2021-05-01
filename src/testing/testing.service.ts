import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TestingService {
  constructor(@InjectConnection() private connection: Connection) {}

  async dropDatabase() {
    if (process.env.ENVIRONMENT == 'TEST') {
      this.connection.collection('users').deleteMany({});
      this.connection.collection('reviews').deleteMany({});
    }
  }
}
