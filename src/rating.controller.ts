import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RatingService } from './rating.service';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  async rate(@Body() body: { userId: number; bookId: number; value: number }) {
    return this.ratingService.rateBook(body.userId, body.bookId, body.value);
  }

  @Get('book/:bookId')
  async stats(@Param('bookId') bookId: string) {
    return this.ratingService.getBookRatingStats(Number(bookId));
  }
}
