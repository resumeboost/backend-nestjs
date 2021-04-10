import { Test, TestingModule } from '@nestjs/testing';

import CreateUserDto from './dto/createUser.dto';
import { StorageService } from './../storage/storage.service';
import UpdateUserDto from './dto/updateUser.dto';
import { User } from '../schemas/user.schema';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';

describe('UserService', () => {
  let service: UserService;
  let findOne: jest.Mock;
  let find: jest.Mock;
  let findOneAndUpdate: jest.Mock;
  let findByIdAndUpdate: jest.Mock;
  let create: jest.Mock;

  beforeEach(async () => {
    findOne = jest.fn();
    find = jest.fn();
    findOneAndUpdate = jest.fn();
    findByIdAndUpdate = jest.fn();
    create = jest.fn();

    const StorageServiceProvider = {
      provide: StorageService,
      useFactory: () => ({
        upload: jest.fn(),
        getFile: jest.fn(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne,
            find,
            findOneAndUpdate,
            findByIdAndUpdate,
            create,
          },
        },
        StorageServiceProvider,
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

  describe('getUser', () => {
    it('should return user with given id', async () => {
      const user = new User();
      findOne.mockReturnValue({
        exec: jest.fn().mockReturnValue(
          Promise.resolve({
            toJSON: jest.fn().mockReturnValue(user),
          }),
        ),
      });

      const fetchedUser = await service.getUser('test');
      expect(fetchedUser).toEqual(user);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users in the databse', async () => {
      const users = [new User()];
      find.mockReturnValue({
        exec: jest.fn().mockReturnValue(Promise.resolve(users)),
      });

      const fetchedUsers = await service.getAllUsers();
      expect(fetchedUsers).toEqual(users);
    });
  });

  describe('updateUser', () => {
    it('should update users with specified fields', async () => {
      const user = new User();
      findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockReturnValue(Promise.resolve(user)),
      });
      const id = '9999999';
      const updateUserDto = new UpdateUserDto();
      updateUserDto.email = 'New test email';
      updateUserDto.targetCompanies = ['new test co 1', 'new test co 2'];

      const fetchedUser = await service.updateUser(id, updateUserDto);
      expect(fetchedUser).toEqual(user);
    });
  });

  // describe('putResumeActive', () => {
  //   it('should make given users resume active', async () => {
  //     const user = new User();
  //     const date = new Date();
  //     user.email = 'test@gmail.com';
  //     user.password = 'password';
  //     user.resumes = [
  //       {
  //         link: 'test link',
  //         createdAt: date,
  //         isActive: false,
  //       },
  //     ];

  //     findById.mockReturnValue({
  //       exec: jest.fn().mockReturnValue(Promise.resolve(user)),
  //     });

  //     const message = await service.putResumeActive('1000');
  //     expect(message).toEqual('Resume was made active');
  //   });
  // });

  // describe('create', () => {
  //   it('should create User with specified fields', async () => {
  //     const userDto = new CreateUserDto();
  //     userDto.email = 'test@example.com';
  //     userDto.password = 'password';
  //     const user = new User();
  //     create.mockReturnValue(
  //       Promise.resolve({
  //         save: Promise.resolve(
  //           jest.fn().mockReturnValue({
  //             toJSON: jest.fn().mockReturnValue(user),
  //           }),
  //         ),
  //       }),
  //     );

  //     const res = await service.create(userDto);
  //     expect(res).toEqual(user);
  //   });
  // });
});
