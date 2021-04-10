import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { Review } from '../schemas/review.schema';
import { ReviewService } from './review.service';
import PostReviewDto from './dto/postReview.dto';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Get()
  async getAllReviews(): Promise<Review[]> {
    const reviews = await this.reviewService.getAllReviews();
    return reviews;
  }

  @Get(':id')
  async getReviewsByUser(@Param('id') id): Promise<Review[]> {
    const reviews = await this.reviewService.getReviewsByUser(id);
    return reviews;
  }

  @Post('/postReview')
  async postReview(@Body() postReviewDto: PostReviewDto): Promise<string> {
    return this.reviewService.postReview(postReviewDto);
  }
}
