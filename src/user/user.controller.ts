import { Controller, Get, Request, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const { password, ...userData } = req.user;
    return userData;
  }

  @Get()
  async getAllUsers() {
    const returnedUsers = await this.userService.getAllUsers();
    return returnedUsers;
    //   if (returnedUsers.length == 0) {
    //     return 'No users found';
    //   } else {
    //     return 'Users found';
    //   }
  }
}
