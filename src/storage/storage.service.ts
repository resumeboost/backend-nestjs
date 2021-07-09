import { Injectable } from '@nestjs/common';
import { InjectS3, S3 } from 'nestjs-s3';

@Injectable()
export class StorageService {
  constructor(@InjectS3() private readonly s3: S3) {}

  async upload(file: Express.Multer.File, filename: string) {
    const S3params = {
      Bucket: process.env['AWS_BUCKET_NAME'],
      Key: filename,
      Body: file.buffer,
    };

    return await this.s3
      .upload(S3params)
      .promise()
      .then((data) => data.Location);
  }

  async getFile(filename: string): Promise<any> {
    const S3params = {
      Bucket: process.env['AWS_BUCKET_NAME'],
      Key: filename,
    };

    return await this.s3
      .getObject(S3params)
      .promise()
      .then((data) => data.Body);
  }
}
