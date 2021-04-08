import { Model } from 'mongoose';

import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument, UserSchema } from '../schemas/user.schema';
import CreateUserDto from './dto/createUser.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getById(id: string): Promise<User> {
    return (await this.userModel.findById(id).exec()).toJSON();
  }

  async getByEmail(email: string): Promise<User> {
    return (await this.userModel.findOne({ email }).exec()).toJSON();
  }

  async create(userData: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(userData);
    await newUser.save();
    return newUser.toJSON();
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userModel.find().exec();
  }
}
