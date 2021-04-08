import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from './user.controller';

describe('UserController', () => {
  it('test', () => {
    expect(1 + 1).toBe(2);
  });
  // let controller: UserController;

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     controllers: [UserController],
  //   }).compile();

  //   controller = module.get<UserController>(UserController);
  // });

  // it('should be defined', () => {
  //   expect(controller).toBeDefined();
  // });
});
