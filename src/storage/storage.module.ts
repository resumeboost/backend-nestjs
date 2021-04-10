import { Module } from '@nestjs/common';
import { S3Module } from 'nestjs-s3';
import { StorageService } from './storage.service';

@Module({
  imports: [
    S3Module.forRoot({
      config: {
        accessKeyId: process.env['AWS_ID'],
        secretAccessKey: process.env['AWS_SECRET'],
        endpoint: 'http://127.0.0.1:8080',
        // s3ForcePathStyle: true,
        // signatureVersion: 'v4',
      },
    }),
  ],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
