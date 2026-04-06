import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { RatingService } from './rating.service';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  // ⭐ SPRINT 3 — Rate a Book
  @Post(':userId/:bookId')
  rateBook(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body('value', ParseIntPipe) value: number,
  ) {
    return this.ratingService.rateBook(userId, bookId, value);
  }

  // ⭐ SPRINT 4 — Get Average Rating
  @Get('book/:bookId/average')
  getAverageRating(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.ratingService.getAverageRating(bookId);
  }

  // ⭐ SPRINT 4 — Get All Ratings for a Book
  @Get('book/:bookId')
  getRatingsForBook(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.ratingService.getRatingsForBook(bookId);
  }

  // ⭐ SPRINT 4 — Get User Rating
  @Get(':userId/:bookId')
  getUserRating(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.ratingService.getUserRating(userId, bookId);
  }

  // ⭐ SPRINT 4 — Delete Rating
  @Delete(':userId/:bookId')
  deleteRating(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.ratingService.deleteRating(userId, bookId);
  }
}
