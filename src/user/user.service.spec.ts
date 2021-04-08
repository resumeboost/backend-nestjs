import { Model } from 'mongoose';

import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { ApiForbiddenResponse } from '@nestjs/swagger';
import { Test, TestingModule } from '@nestjs/testing';

import { User, UserDocument, UserSchema } from '../schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let findOne: jest.Mock;

  beforeEach(async () => {
    findOne = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne,
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when getting a user by email', () => {
    describe('and the user is matched', () => {
      it('should return the user', async () => {
        const user = new User();
        findOne.mockReturnValue({
          exec: jest.fn().mockReturnValue(
            Promise.resolve({
              toJSON: jest.fn().mockReturnValue(user),
            }),
          ),
        });
        const fetchedUser = await service.getByEmail('test@test.com');
        expect(fetchedUser).toEqual(user);
      });
    });

    // describe('and the user is not matched', () => {
    //   it('throws Unauthorized exception', async () => {
    //     findOne.mockReturnValue({
    //       exec: jest.fn().mockReturnValue(Promise.reject(null)),
    //     });
    //     await expect(await service.getByEmail('test@test.com')).toThrow();
    //   });
    // });
  });
});
