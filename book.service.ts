import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto.ts';
import { PrismaService } from './prisma/prisma.service'; 

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  async createBook(createBookDto: CreateBookDto) {
    try {
      const book = await this.prisma.book.create({
        data: {
          isbn: createBookDto.isbn,
          name: createBookDto.name,
          description: createBookDto.description,
          price: createBookDto.price,
          author: createBookDto.author,
          genre: createBookDto.genre,
          publisher: createBookDto.publisher,
          yearPublished: createBookDto.yearPublished,
          copiesSold: createBookDto.copiesSold,
        },
      });

      return book;
    } catch (error) {
      throw new Error(`Failed to create book: ${error.message}`);
    }
  }
}