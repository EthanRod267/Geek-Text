import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('cart')
export class CartController {
  constructor(private prisma: PrismaService) {}

  @Get(':userId/items')
  async getCartItems(@Param('userId') userId: string) {
    const userIdNum = Number(userId);

    const cart = await this.prisma.cart.findUnique({
      where: { userId: userIdNum },
      include: {
        items: {
          include: { book: true },
        },
      },
    });

    if (!cart) {
      return { userId: userIdNum, items: [] };
    }

    return {
      userId: userIdNum,
      cartId: cart.id,
      items: cart.items.map((item) => ({
        bookId: item.bookId,
        title: item.book.title,
        price: item.book.price,
        quantity: item.quantity,
      })),
    };
  }
}
