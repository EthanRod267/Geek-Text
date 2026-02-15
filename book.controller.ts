import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { AdminGuard } from './auth/guards/admin.guard'; // You'll need to implement this

@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}

  @Post()
  @UseGuards(AdminGuard) // Only administrators can create books
  @HttpCode(HttpStatus.CREATED)
  async createBook(@Body() createBookDto: CreateBookDto) {
    await this.bookService.createBook(createBookDto);
    // Response is None (no return data)
    return;
  }
    @Get('genre/:genre')
  async getByGenre(@Param('genre') genre: string) {
    return this.bookService.getBooksByGenre(genre);
  }

  @Get('top-sellers')
  async getTopSellers() {
    return this.bookService.getTopSellers();
  }
}
