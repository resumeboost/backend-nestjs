import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class StorageService {
  private s3: S3;
  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env['AWS_ID'],
      secretAccessKey: process.env['AWS_SECRET'],
    });
  }

  async upload(file: Express.Multer.File, filename: string) {
    const S3params = {
      ACL: 'public-read',
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
