import { Controller, Delete, Get } from '@nestjs/common';

import { TestingService } from './testing.service';

@Controller('testing')
export class TestingController {
  constructor(private readonly testingService: TestingService) {}

  @Get('coverage')
  getCodeCoverage() {
    // @ts-expect-error Code coverage nyc
    if (global.__coverage__) {
      return {
        //   @ts-expect-error NYC Coverage
        coverage: global.__coverage__,
      };
    }
  }

  // TODO: Get rid of this
  @Delete('database')
  dropDatabase() {
    this.testingService.dropDatabase();
  }
}
