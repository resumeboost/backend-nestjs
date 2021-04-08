import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from '../schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  const findOne = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
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

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('returns empty array when no users', async () => {
      const mockedValue = [new User()];
      jest
        .spyOn(service, 'getAllUsers')
        .mockImplementation(jest.fn().mockReturnValue(mockedValue));

      const returnedValue = await controller.getAllUsers();
      expect(returnedValue).toBe('Users found');
    });

    it('displays no users found', async () => {
      const mockedValue = [];
      jest
        .spyOn(service, 'getAllUsers')
        .mockImplementation(jest.fn().mockReturnValue(mockedValue));

      const returnedValue = await controller.getAllUsers();
      expect(returnedValue).toBe('No users found');
    });
  });
});
