import { Module } from '@nestjs/common';
import { S3Module } from 'nestjs-s3';
import { StorageService } from './storage.service';

@Module({
  imports: [
    S3Module.forRoot({
      config: {
        accessKeyId: process.env['AWS_ID'],
        secretAccessKey: process.env['AWS_SECRET'],
      },
    }),
  ],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
