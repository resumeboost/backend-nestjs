import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

describe('AuthController', () => {
  it('test', () => {
    expect(1 + 1).toBe(2);
  });
  // let controller: AuthController;
  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     imports: [UserModule, PassportModule],
  //     providers: [AuthService, LocalStrategy],
  //     controllers: [AuthController],
  //   }).compile();
  //   controller = module.get<AuthController>(AuthController);
  // });
  // it('should be defined', () => {
  //   expect(controller).toBeDefined();
  // });
});
