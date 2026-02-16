import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async rateBook(userId: number, bookId: number, value: number) {
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new BadRequestException('Rating value must be an integer from 1 to 5.');
    }

    // If rating exists, update it; otherwise create it
    return (this.prisma as any).rating.upsert({
      where: { userId_bookId: { userId, bookId } },
      update: { value },
      create: { userId, bookId, value },
    });
  }

  async getBookRatingStats(bookId: number) {
    const result = await (this.prisma as any).rating.aggregate({
      where: { bookId },
      _avg: { value: true },
      _count: { value: true },
    });

    return {
      bookId,
      average: result._avg.value ?? 0,
      totalRatings: result._count.value,
    };
  }
}
