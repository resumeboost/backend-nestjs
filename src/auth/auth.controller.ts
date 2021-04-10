import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import RegisterDto from './dto/registerUser.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const accessToken = (await this.authService.login(req.user)).access_token;
    response.cookie('access_token', accessToken);
  }

  @Post('signup')
  async register(@Body() registrationData: RegisterDto) {
    return this.authService.registerUser(registrationData);
  }

  @Get('logout')
  async logout(@Request() req, @Res({ passthrough: true }) response: Response) {
    req.logout();
    response.clearCookie('access_token');
  }
}
