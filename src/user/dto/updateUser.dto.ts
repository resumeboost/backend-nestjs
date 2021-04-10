import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  email?: string;

  @ApiProperty()
  password?: string;

  @ApiProperty()
  points?: number;

  @ApiProperty()
  targetCompanies?: string[];

  @ApiProperty()
  targetPositions?: string[];

  @ApiProperty()
  resumes?: {
    link: string;
    createdAt: Date;
    isActive: boolean;
  }[];
}

export default UpdateUserDto;
