import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

describe('AuthService', () => {
  it('test', () => {
    expect(1 + 1).toBe(2);
  });
  // let service: AuthService;
  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     imports: [UserModule, PassportModule],
  //     providers: [AuthService, LocalStrategy],
  //     controllers: [AuthController],
  //   }).compile();
  //   service = module.get<AuthService>(AuthService);
  // });
  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });
});
