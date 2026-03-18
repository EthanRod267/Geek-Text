import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BookService } from './book.service';
import { BookController } from './book.controller';


@Module({
  imports: [PrismaModule],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}