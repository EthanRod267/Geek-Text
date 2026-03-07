import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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

  @Post()
  async addBookToCart(@Body() body: { userId: number; bookId: number }) {
    const { userId, bookId } = body;

    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        bookId,
      },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + 1,
        },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        bookId,
        quantity: 1,
      },
    });
  }

  @Delete(':userId/items/:bookId')
  async removeBookFromCart(
    @Param('userId') userId: string,
    @Param('bookId') bookId: string,
  ) {
    const userIdNum = Number(userId);
    const bookIdNum = Number(bookId);

    const cart = await this.prisma.cart.findUnique({
      where: { userId: userIdNum },
    });

    if (!cart) {
      return { message: 'Cart not found' };
    }

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        bookId: bookIdNum,
      },
    });

    if (!cartItem) {
      return { message: 'Book not found in cart' };
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return { message: 'Book removed from cart' };
  }
}