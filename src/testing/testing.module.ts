import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { TestingService } from './testing.service';

@Module({
  providers: [TestingService],
  controllers: [TestingController],
})
export class TestingModule {}
