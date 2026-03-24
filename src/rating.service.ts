import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  // ⭐ SPRINT 3 — Create / Update Rating
  async rateBook(userId: number, bookId: number, value: number) {
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new BadRequestException(
        'Rating value must be an integer from 1 to 5.',
      );
    }

    return this.prisma.rating.upsert({
      where: {
        userId_bookId: { userId, bookId },
      },
      update: {
        value,
      },
      create: {
        userId,
        bookId,
        value,
      },
    });
  }

  // ⭐ SPRINT 4 — Get Average Rating
  async getAverageRating(bookId: number) {
    const result = await this.prisma.rating.aggregate({
      where: { bookId },
      _avg: {
        value: true,
      },
      _count: {
        value: true,
      },
    });

    return {
      average: result._avg.value || 0,
      count: result._count.value,
    };
  }

  // ⭐ SPRINT 4 — Get All Ratings for a Book
  async getRatingsForBook(bookId: number) {
    return this.prisma.rating.findMany({
      where: { bookId },
      include: {
        user: true,
      },
    });
  }

  // ⭐ SPRINT 4 — Get User's Rating
  async getUserRating(userId: number, bookId: number) {
    const rating = await this.prisma.rating.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    return rating;
  }

  // ⭐ SPRINT 4 — Delete Rating (Optional but strong)
  async deleteRating(userId: number, bookId: number) {
    return this.prisma.rating.delete({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });
  }
}
