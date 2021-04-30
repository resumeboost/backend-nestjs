import { ApiProperty } from '@nestjs/swagger';

export class PostReviewDto {
  @ApiProperty()
  revieweeId: string;

  @ApiProperty()
  reviewerId: string;

  @ApiProperty()
  resumeId: string;

  @ApiProperty()
  visual: number;

  @ApiProperty()
  content: number;

  @ApiProperty()
  relevance: number;

  @ApiProperty()
  feedback: string;
}

export default PostReviewDto;
