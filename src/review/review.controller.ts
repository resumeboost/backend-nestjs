import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { Review } from '../schemas/review.schema';
import { ReviewService } from './review.service';
import PostReviewDto from './dto/postReview.dto';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllReviews(): Promise<Review[]> {
    const reviews = await this.reviewService.getAllReviews();
    return reviews;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/:id')
  async getReviewsByUser(@Param('id') id): Promise<Review[]> {
    const reviews = await this.reviewService.getReviewsByUser(id);
    return reviews;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/postReview')
  async postReview(@Body() postReviewDto: PostReviewDto): Promise<string> {
    return this.reviewService.postReview(postReviewDto);
  }
}
