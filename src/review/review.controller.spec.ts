import { Test, TestingModule } from '@nestjs/testing';
import { ReviewController } from './review.controller';
import { Review } from '../schemas/review.schema';
import { ReviewService } from './review.service';
import { getModelToken } from '@nestjs/mongoose';
import PostReviewDto from './dto/postReview.dto';

describe('ReviewController', () => {
  let controller: ReviewController;
  let spyService: ReviewService;
  const findOne = jest.fn();

  beforeEach(async () => {
    const ApiServiceProvider = {
      provide: ReviewService,
      useFactory: () => ({
        postReview: jest.fn(() => 'Thanks for the review!'),
        getReviewsByUser: jest.fn(() => Review),
        getAllReviews: jest.fn(() => Review),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [
        ApiServiceProvider,
        {
          provide: getModelToken(Review.name),
          useValue: {
            findOne,
          },
        },
      ],
    }).compile();

    controller = module.get<ReviewController>(ReviewController);
    spyService = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('postReview', () => {
    it('should return message acknowledging review posting', async () => {
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
      jest
        .spyOn(spyService, 'postReview')
        .mockImplementation(jest.fn().mockReturnValue(mockedValue));

      const returnedValue = await controller.postReview(prDto);
      expect(returnedValue).toBe(mockedValue);
      expect(spyService.postReview).toHaveBeenCalledWith(prDto);
    });
  });

  describe('getReviewsByUser', () => {
    it('should return all the reviews of given user', async () => {
      const mockedValue: Review[] = [
        {
          revieweeId: '605e4efce9e8061ec8a62020',
          reviewerId: '6067bab4039606ec77256832',
          resumeId: '605e4efce9e8061ec8a62022',
          info: [
            {
              visual: 9,
              content: 8,
              relevance: 8,
              feedback: 'Testing post review in JEst',
            },
          ],
        },
      ];

      jest
        .spyOn(spyService, 'getReviewsByUser')
        .mockImplementation(
          async (): Promise<Review[]> => Promise.resolve(mockedValue),
        );
      const id = '605e4efce9e8061ec8a62020';
      const returnedValue = await controller.getReviewsByUser(id);
      expect(returnedValue).toBe(mockedValue);
    });
  });

  describe('getAllReviews', () => {
    it('should return all the reviews in database', async () => {
      const mockedValue: Review[] = [
        {
          revieweeId: '605e4efce9e8061ec8a62020',
          reviewerId: '6067bab4039606ec77256832',
          resumeId: '605e4efce9e8061ec8a62022',
          info: [
            {
              visual: 9,
              content: 8,
              relevance: 8,
              feedback: 'Testing post review in JEst',
            },
          ],
        },
      ];

      jest
        .spyOn(spyService, 'getAllReviews')
        .mockImplementation(
          async (): Promise<Review[]> => Promise.resolve(mockedValue),
        );

      const returnedValue = await controller.getAllReviews();
      expect(returnedValue).toBe(mockedValue);
    });
  });
});
