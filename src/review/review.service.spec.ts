import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { Review } from '../schemas/review.schema';
import { User } from '../schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from '../user/user.service';
import PostReviewDto from './dto/postReview.dto';

describe('ReviewService', () => {
  let service: ReviewService;
  let spyService: UserService;
  let findOne: jest.Mock;
  let find: jest.Mock;
  let create: jest.Mock;

  beforeEach(async () => {
    const UserServiceProvider = {
      provide: UserService,
      useFactory: () => ({
        updateUserPoints: jest.fn(() => Promise.resolve()),
      }),
    };

    findOne = jest.fn();
    find = jest.fn();
    create = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: getModelToken(Review.name),
          useValue: {
            findOne,
            find,
            create,
          },
        },
        UserServiceProvider,
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
    spyService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getReviewsByUser', () => {
    it('should return reviews of a particular user', async () => {
      const review = new Review();
      find.mockReturnValue({
        exec: jest.fn().mockReturnValue(Promise.resolve(review)),
      });

      const fetchedReview = await service.getReviewsByUser('test');
      expect(fetchedReview).toEqual(review);
    });
  });

  describe('getAllReviews', () => {
    it('should return all the reviews in database', async () => {
      const reviews = [new Review()];
      find.mockReturnValue({
        exec: jest.fn().mockReturnValue(Promise.resolve(reviews)),
      });

      const fetchedReviews = await service.getAllReviews();
      expect(fetchedReviews).toEqual(reviews);
    });
  });

  describe('postReview', () => {
    it('user should be able to post review and recieve message', async () => {
      const prDto = new PostReviewDto();
      prDto.revieweeId = '605e4efce9e8061ec8a62020';
      prDto.reviewerId = '6067bab4039606ec77256832';
      prDto.resumeId = '605e4efce9e8061ec8a62022';
      prDto.info = [
        {
          visual: 9,
          content: 8,
          relevance: 8,
          feedback: 'Testing post review in JEst',
        },
      ];
      const mockedValue = 'Thanks for the review!';
      create.mockReturnValue({
        exec: jest.fn().mockReturnValue(Promise.resolve(mockedValue)),
      });
      const result = await service.postReview(prDto);

      expect(result).toEqual(mockedValue);
      expect(spyService.updateUserPoints).toHaveBeenCalledWith(
        '605e4efce9e8061ec8a62020',
        -1,
      );
      expect(spyService.updateUserPoints).toHaveBeenCalledWith(
        '6067bab4039606ec77256832',
        1,
      );
    });
  });
});
