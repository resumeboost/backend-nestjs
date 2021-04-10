// import bcrypt from 'bcryptjs';
import * as bcrypt from 'bcryptjs';

import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User, UserDocument } from '../schemas/user.schema';
import { UserService } from '../user/user.service';
import RegisterDto from './dto/registerUser.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async registerUser(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);

    const createdUser = await this.userService.create({
      ...registrationData,
      password: hashedPassword,
    });

    const { password, ...result } = createdUser;
    return result;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.getByEmail(email);
    if (user) {
      await this.verifyPassword(pass, user.password);

      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserDocument) {
    const payload = { sub: user._id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env['JWT_SECRET_KEY'],
      }),
    };
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
