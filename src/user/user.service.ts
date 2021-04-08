import { Model } from 'mongoose';

import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument, UserSchema } from '../schemas/user.schema';
import CreateUserDto from './dto/createUser.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getByEmail(email: string): Promise<User | undefined> {
    try {
      return (await this.userModel.findOne({ email }).exec()).toJSON();
    } catch (err) {
      this.logger.error(err);
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  async create(userData: CreateUserDto): Promise<User> {
    try {
      const newUser = new this.userModel(userData);
      await newUser.save();
      return newUser.toJSON();
    } catch (err) {
      this.logger.error(err);
      throw new HttpException(
        'User with that email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  async getAllUsers(): Promise<User[]> {
    return await this.userModel.find();
  }
}
