import { Test, TestingModule } from '@nestjs/testing';

import { StorageService } from './storage.service';
import { Multer } from 'multer';

const mS3Instance = {
  upload: jest.fn().mockReturnThis(),
  promise: jest.fn(),
  getObject: jest.fn().mockReturnThis(),
};

jest.mock('aws-sdk', () => {
  return { S3: jest.fn(() => mS3Instance) };
});

jest.mock('multer', () => {
  return {
    File: jest.fn().mockReturnThis(),
  };
});

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageService],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return data location on upload', () => {
    const resp = { Location: 'dummy_path' };
    const empty_file = { buffer: 'dummyvalue' };

    mS3Instance.upload.mockResolvedValue(resp);
    expect(service.upload(empty_file, 'dummy_filename')).resolves.toBe(resp);
  });

  it('should return data string on getFile', () => {
    const resp = { Body: 109238 };

    mS3Instance.upload.mockResolvedValue(resp);
    expect(service.getFile('dummy_file_name')).resolves.toBe(resp.Body.toString());
  });
});
