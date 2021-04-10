import * as _ from 'lodash';

import { StorageService } from './../storage/storage.service';
import { Express } from 'express';

import {
  HttpException,
  HttpStatus,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import UpdateUserDto from './dto/updateUser.dto';
import { User } from '../schemas/user.schema';

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
  async getAllUsers(): Promise<User[]> {
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

  @Get('/resume/:resumeLink')
  async getResume(@Param('resumeLink') resumeLink) {
    return await this.userService.getResume(resumeLink);
  }

  // TODO: Add update user resume method.
}
