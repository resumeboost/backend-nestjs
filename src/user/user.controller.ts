import { Controller, Get } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @Get()
  // async getAllUsers() {
  //   return await this.userService.getAllUsers();
  // }

  @Get()
  async getAllUsers(): Promise<string> {
    const returnedUsers = await this.userService.getAllUsers();
    if (returnedUsers.length == 0) {
      return 'No users found';
    } else {
      return 'Users found';
    }
  }
}
