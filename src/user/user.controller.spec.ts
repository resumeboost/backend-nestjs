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
    it('should return all the users in the database', async () => {
      const d = new Date();
      const mockedValue: User[] = [
        {
          email: 'test@gmail.com',
          password: 'password',
          points: 10,
          targetCompanies: ['comp 1', 'comp 2'],
          targetPositions: ['Intern', 'Full time'],
          resumes: [
            {
              link: 'test link',
              createdAt: d,
              isActive: false,
            },
          ],
        },
      ];
      jest
        .spyOn(service, 'getAllUsers')
        .mockImplementation(
          async (): Promise<User[]> => Promise.resolve(mockedValue),
        );

      const returnedValue = await controller.getAllUsers();
      expect(returnedValue).toBe(mockedValue);
    });
  });

  describe('getUser', () => {
    it('should return a user based on id given', async () => {
      const d = new Date();
      const mockedValue: User = {
        email: 'test@gmail.com',
        password: 'password',
        points: 10,
        targetCompanies: ['comp 1', 'comp 2'],
        targetPositions: ['Intern', 'Full time'],
        resumes: [
          {
            link: 'test link',
            createdAt: d,
            isActive: false,
          },
        ],
      };
      jest
        .spyOn(service, 'getUser')
        .mockImplementation(
          async (): Promise<User> => Promise.resolve(mockedValue),
        );

      const returnedValue = await controller.getUser('1');
      expect(returnedValue).toBe(mockedValue);
    });
  });
});
