import { StorageService } from './../storage/storage.service';
import { Model, Types } from 'mongoose';

import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from '../schemas/user.schema';
import UpdateUserDto from './dto/updateUser.dto';
import CreateUserDto from './dto/createUser.dto';
import UserDto from './dto/user.dto';
import { v4 as uuid } from 'uuid';

const { ObjectId } = Types;
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

  async delete(id: string): Promise<User> {
    return (await this.userModel.findOneAndDelete({ _id: id }).exec()).toJSON();
  }

  async deleteResume(uid: string, resume_id: string): Promise<User> {
    return await this.userModel
      .findByIdAndUpdate(uid, {
        $pull: { resumes: { _id: resume_id } },
      })
      .exec();
  }

  async create(userData: CreateUserDto): Promise<User> {
    const newUser = await this.userModel.create(userData);
    await newUser.save();
    return newUser.toJSON();
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userModel.find().exec();
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

  async uploadResume(userId: string, resumeFile: Express.Multer.File) {
    console.log(resumeFile);
    const filename = uuid() + '.pdf';
    await this.storageService.upload(resumeFile, filename);

    const newResume = {
      _id: filename,
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

  async getNextUserToReview(userId: string): Promise<UserDocument> {
    const SAMPLE_SIZE = 5;
    const MAX_RETRIES = 3;

    let users: UserDocument[];
    let retries = 0;

    while (retries < MAX_RETRIES && (!users || users.length == 0)) {
      users = await this.userModel
        .aggregate([
          // Sample random documents
          {
            $sample: {
              size: SAMPLE_SIZE,
            },
          },
          // Filter out current user, users with non-positive points and no resumes
          {
            $match: {
              points: {
                $gt: 0,
              },
              resumes: {
                $exists: true,
                $ne: [],
              },
              _id: {
                $ne: ObjectId(userId),
              },
            },
          },
          // Convert objectID to string type for lookup
          {
            $addFields: {
              id: {
                $toString: '$_id',
              },
            },
          },
          // Join on reviews table and bring in reviewers for the sampled users
          {
            $lookup: {
              from: 'reviews',
              let: {
                id: '$id',
              },
              pipeline: [
                // Join on id = revieweeId
                {
                  $match: {
                    $expr: {
                      $eq: ['$revieweeId', '$$id'],
                    },
                  },
                },
                {
                  $project: {
                    reviewerId: 1,
                    _id: 0,
                  },
                },
              ],
              as: 'reviewedBy',
            },
          },
          // Filter out sampled users that the current user has already reviewed
          {
            $match: {
              'reviewedBy.reviewerId': {
                $ne: userId,
              },
            },
          },
        ])
        .exec();
      retries += 1;
    }

    if (!users || users.length == 0) {
      throw new Error('Could not find users to review. Please try again later');
    }

    return users[0];
  }

  async getResume(link: string) {
    return await this.storageService.getFile(link);
  }
}
