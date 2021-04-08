export class UserDto {
  id?: string;
  _id?: string;
  email: string;
  points: number;
  targetCompanies: string[];
  targetPositions: string[];
  resumes: {
    link: string;
    createdAt: Date;
    isActive: boolean;
  }[];
}

export default UserDto;
