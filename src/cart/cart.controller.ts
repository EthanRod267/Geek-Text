import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('cart')
export class CartController {
  constructor(private prisma: PrismaService) {}

  @Get(':userId/items')
  async getCartItems(@Param('userId') userId: string) {
    const userIdNum = Number(userId);

    if (isNaN(userIdNum)) {
      throw new BadRequestException('Invalid userId');
    }

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
  @HttpCode(204)
  async addBookToCart(@Body() body: { userId: number; bookId: number }) {
    const { userId, bookId } = body;

    if (isNaN(Number(userId)) || isNaN(Number(bookId))) {
      throw new BadRequestException('Invalid userId or bookId');
    }

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
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + 1,
        },
      });
      return;
    }

    await this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        bookId,
        quantity: 1,
      },
    });
  }

  @Delete(':userId/items/:bookId')
  @HttpCode(204)
  async removeBookFromCart(
    @Param('userId') userId: string,
    @Param('bookId') bookId: string,
  ) {
    const userIdNum = Number(userId);
    const bookIdNum = Number(bookId);

    if (isNaN(userIdNum) || isNaN(bookIdNum)) {
      throw new BadRequestException('Invalid userId or bookId');
    }

    const cart = await this.prisma.cart.findUnique({
      where: { userId: userIdNum },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        bookId: bookIdNum,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Book not found in cart');
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItem.id },
    });
  }

  @Get(':userId/subtotal')
  async getCartSubtotal(@Param('userId') userId: string) {
    const userIdNum = Number(userId);

    if (isNaN(userIdNum)) {
      throw new BadRequestException('Invalid userId');
    }

    const cart = await this.prisma.cart.findUnique({
      where: { userId: userIdNum },
      include: {
        items: {
          include: { book: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return {
        userId: userIdNum,
        subtotal: 0,
      };
    }

    const subtotal = cart.items.reduce((total, item) => {
      return total + Number(item.book.price) * item.quantity;
    }, 0);

    return {
      userId: userIdNum,
      cartId: cart.id,
      subtotal,
    };
  }
}
