import { Model } from 'mongoose';

import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Review, ReviewDocument } from '../schemas/review.schema';
import { UserService } from '../user/user.service';
import PostReviewDto from './dto/postReview.dto';

@Injectable()
export class ReviewService {
  private readonly logger = new Logger(ReviewService.name);
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private userService: UserService,
  ) {}

  async getAllReviews(): Promise<Review[]> {
    return await this.reviewModel.find().exec();
  }

  async getReviewsByUser(id: string): Promise<Review[]> {
    const review = await this.reviewModel.find({ revieweeId: id }).exec();
    return review;
  }

  async postReview(reviewData: PostReviewDto): Promise<string> {
    const review = await this.reviewModel.create({
      revieweeId: reviewData.revieweeId,
      reviewerId: reviewData.reviewerId,
      resumeId: reviewData.resumeId,
      info: reviewData.info,
    });

    this.userService.updateUserPoints(reviewData.revieweeId, -1);
    this.userService.updateUserPoints(reviewData.reviewerId, 1);

    return 'Thanks for the review!';
  }
}
