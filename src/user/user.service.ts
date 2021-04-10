import { StorageService } from './../storage/storage.service';
import { Model } from 'mongoose';

import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument, UserSchema } from '../schemas/user.schema';
import CreateUserDto from './dto/createUser.dto';
import UserDto from './dto/user.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private storageService: StorageService,
  ) {}

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

  async uploadResume(userId: string, resumeFile: Express.Multer.File) {
    const filename = uuid() + '.pdf';
    await this.storageService.upload(resumeFile, filename);

    const newResume = {
      link: filename,
      createdAt: new Date(),
      isActive: true,
    };

    await this.userModel
      .findByIdAndUpdate(userId, {
        // Make all other resumes inactive
        $set: {
          'resumes.$[].isActive': false,
        },
      })
      .exec();

    await this.userModel
      .findByIdAndUpdate(userId, {
        // Push new resume
        $push: {
          resumes: newResume,
        },
      })
      .exec();
  }

  async getNextUserToReview(): Promise<UserDocument> {
    return (
      await this.userModel
        .aggregate([
          {
            $match: {
              points: { $gt: 0 },
            },
          },
          { $sample: { size: 1 } },
        ])
        .exec()
    )[0];
  }
}
