import { ApiProperty } from '@nestjs/swagger';

export class PostReviewDto {
  @ApiProperty()
  revieweeId: string;

  @ApiProperty()
  reviewerId: string;

  @ApiProperty()
  resumeId: string;

  @ApiProperty()
  info: {
    visual: number;
    content: number;
    relevance: number;
    feedback: string;
  }[];
}

export default PostReviewDto;
