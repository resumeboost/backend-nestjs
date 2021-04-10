import * as _ from 'lodash';

import { StorageService } from './../storage/storage.service';
import { Express } from 'express';

import {
  HttpException,
  HttpStatus,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private storageService: StorageService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const { password, ...userData } = req.user;
    return userData;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/resume')
  @UseInterceptors(
    FileInterceptor('resume', {
      fileFilter: (_, file, cb) => {
        if (file.mimetype == 'application/pdf') {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(
            new HttpException(
              'Only .pdf files allowed!',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
      // 1 MB file size limit
      limits: { fileSize: 1024 * 1024 },
    }),
  )
  async uploadResume(
    @Request() req,
    @Param() params,
    @UploadedFile() resumeFile: Express.Multer.File,
  ) {
    return await this.userService.uploadResume(req.user._id, resumeFile);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    const returnedUsers = await this.userService.getAllUsers();
    return returnedUsers;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/review/next')
  async getNextUserToReview() {
    const user = await this.userService.getNextUserToReview();
    const userData = _.pick(user, [
      '_id',
      'targetPositions',
      'targetCompanies',
    ]);

    const activeResume = user.resumes.filter(
      (resume) => resume.isActive === true,
    )[0];

    const resumeFile = await this.storageService.getFile(activeResume.link);

    return {
      user: userData,
      resumeFile,
    };
  }
}
