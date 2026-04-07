import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CartModule } from './cart/cart.module';
import { BookModule } from './book/book.module';
import { AuthorModule } from './author/author.module';
import { RatingModule } from './rating.module';
import { WishlistsModule } from './wishlists/wishlists.module';

@Module({
  imports: [
    PrismaModule,
    CartModule,
    BookModule,
    AuthorModule,
    RatingModule,
    WishlistsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}