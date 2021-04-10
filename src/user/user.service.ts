import { Model } from 'mongoose';

import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from '../schemas/user.schema';
import UpdateUserDto from './dto/updateUser.dto';
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

  async getAllUsers(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async getUser(id: string): Promise<User> {
    return (await this.userModel.findOne({ _id: id }).exec()).toJSON();
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<User> {
    //console.log('updating user.....');
    const user = await this.userModel
      .findOneAndUpdate({ _id: id }, userData)
      .exec();
    return user;
  }

  async putResumeActive(id: string): Promise<string> {
    const user = await this.userModel.findById(id).exec();
    user.resumes[0].isActive = true; // TODO: Change it to filter by resume ID
    user.save();
    return 'Resume was made active';
  }

  async updateUserPoints(id: string, num_points: number) {
    await this.userModel
      .findByIdAndUpdate(id, { $inc: { points: num_points } })
      .exec();
  }

  async create(userData: CreateUserDto): Promise<User> {
    const newUser = await this.userModel.create(userData);
    await newUser.save();
    return newUser.toJSON();
  }
}
