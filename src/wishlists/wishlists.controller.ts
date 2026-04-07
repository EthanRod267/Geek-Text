import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { WishlistsService } from "./wishlists.service";
import { CreateWishlistDto } from "./dto/create-wishlist.dto";
import { AddBookDto } from "./dto/add-book.dto";
import { MoveBookDto } from "./dto/move-book.dto";

@Controller("users/:userId/wishlists")
export class WishlistsController {
  constructor(private readonly service: WishlistsService) {}

  // ✅ GET /users/:userId/wishlists
  @Get()
  listWishlists(@Param("userId") userId: string) {
    return this.service.listWishlists(Number(userId));
  }

  // ✅ POST /users/:userId/wishlists
  @Post()
  create(@Param("userId") userId: string, @Body() dto: CreateWishlistDto) {
    return this.service.createWishlist(Number(userId), dto.name);
  }

  // ✅ GET /users/:userId/wishlists/primary
  @Get("primary")
  getPrimary(@Param("userId") userId: string) {
    return this.service.getPrimary(Number(userId));
  }

  // ✅ POST /users/:userId/wishlists/:wishlistId/books
  @Post(":wishlistId/books")
  addBook(
    @Param("userId") userId: string,
    @Param("wishlistId") wishlistId: string,
    @Body() dto: AddBookDto,
  ) {
    return this.service.addBook(Number(userId), Number(wishlistId), dto.bookId);
  }

  // ✅ DELETE /users/:userId/wishlists/:wishlistId/books/:bookId
  @Delete(":wishlistId/books/:bookId")
  removeBook(
    @Param("userId") userId: string,
    @Param("wishlistId") wishlistId: string,
    @Param("bookId") bookId: string,
  ) {
    return this.service.removeBook(
      Number(userId),
      Number(wishlistId),
      Number(bookId),
    );
  }

  // ✅ GET /users/:userId/wishlists/:wishlistId/books
  @Get(":wishlistId/books")
  listBooks(
    @Param("userId") userId: string,
    @Param("wishlistId") wishlistId: string,
  ) {
    return this.service.listBooks(Number(userId), Number(wishlistId));
  }

  // ✅ POST /users/:userId/wishlists/move-book
  @Post("move-book")
  moveBook(@Param("userId") userId: string, @Body() dto: MoveBookDto) {
    return this.service.moveBook(
      Number(userId),
      dto.bookId,
      dto.fromWishlistId,
      dto.toWishlistId,
    );
  }
}
