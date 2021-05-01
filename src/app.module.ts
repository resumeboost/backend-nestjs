import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewModule } from './review/review.module';
import { StorageModule } from './storage/storage.module';
import { StorageService } from './storage/storage.service';
import { TestingController } from './testing/testing.controller';
import { TestingModule } from './testing/testing.module';
import { UserModule } from './user/user.module';

// TODO: Set MongoDb link based on ENV
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env['MONGODB_URI'], {
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    UserModule,
    AuthModule,
    ReviewModule,
    StorageModule,
    TestingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
