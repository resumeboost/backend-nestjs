import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // TODO: Remove
  getHello(): string {
    return 'Hello World!';
  }
}
