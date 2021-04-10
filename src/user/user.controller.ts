import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { UserService } from './user.service';
import UpdateUserDto from './dto/updateUser.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    const returnedUsers = await this.userService.getAllUsers();
    return returnedUsers;
  }

  @Get(':id')
  async getUser(@Param('id') id): Promise<User> {
    return this.userService.getUser(id);
  }

  @Post('/update/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Put('/:id/resume')
  async putResumeActive(@Param('id') id): Promise<string> {
    return this.userService.putResumeActive(id);
  }

  // TODO: Add update user resume method.
}
