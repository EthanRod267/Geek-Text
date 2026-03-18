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
import { AdminGuard } from '../../admin.guard';
import { CreateBookDto } from '../../dto/createBook.dto';


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
    /**
     * GET /books/:isbn
     * Retrieve book details by ISBN
     * Parameters: isbn (string)
     * Response: Book object JSON
     */
    @Get(':isbn')
    async getBookByIsbn(@Param('isbn') isbn: string) {
      return this.bookService.getBookByIsbn(isbn);
    }
    @Get('genre/:genre')
  async getByGenre(@Param('genre') genre: string) {
    return this.bookService.getBooksByGenre(genre);
  }

  @Get('top-sellers')
  async getTopSellers() {
    return this.bookService.getTopSellers();
  }
    @Get('publisher/:publisher')
  async getByPublisher(@Param('publisher') publisher: string) {
    return this.bookService.getBooksByPublisher(publisher);
  }
}
