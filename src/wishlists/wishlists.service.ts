import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class WishlistsService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ GET /users/:userId/wishlists
  async listWishlists(userId: number) {
    return this.prisma.wishlist.findMany({
      where: { userId },
      orderBy: [{ isPrimary: "desc" }, { id: "asc" }],
    });
  }

  // ✅ POST /users/:userId/wishlists
  async createWishlist(userId: number, name: string) {
    // If this is the user's first wishlist, make it primary
    const count = await this.prisma.wishlist.count({ where: { userId } });

    return this.prisma.wishlist.create({
      data: {
        userId,
        name,
        isPrimary: count === 0,
      },
    });
  }

  // ✅ GET /users/:userId/wishlists/primary
  async getPrimary(userId: number) {
    const primary = await this.prisma.wishlist.findFirst({
      where: { userId, isPrimary: true },
    });

    if (primary) return primary;

    // If none exists but user has wishlists, pick first and promote
    const any = await this.prisma.wishlist.findFirst({
      where: { userId },
      orderBy: { id: "asc" },
    });

    if (!any) throw new NotFoundException("No wishlists found for this user.");

    return this.prisma.wishlist.update({
      where: { id: any.id },
      data: { isPrimary: true },
    });
  }

  // ✅ POST /users/:userId/wishlists/:wishlistId/books
  async addBook(userId: number, wishlistId: number, bookId: number) {
    // Confirm wishlist belongs to user
    const wishlist = await this.prisma.wishlist.findFirst({
      where: { id: wishlistId, userId },
    });
    if (!wishlist) throw new NotFoundException("Wishlist not found for this user.");

    // Confirm book exists
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new NotFoundException("Book not found.");

    // Prevent duplicates (WishlistItem has composite PK (wishlistId, bookId))
    try {
      await this.prisma.wishlistItem.create({
        data: { wishlistId, bookId },
      });
    } catch {
      // If duplicate, just return current list
      return this.listBooks(userId, wishlistId);
    }

    return this.listBooks(userId, wishlistId);
  }

  // ✅ DELETE /users/:userId/wishlists/:wishlistId/books/:bookId
  async removeBook(userId: number, wishlistId: number, bookId: number) {
    const wishlist = await this.prisma.wishlist.findFirst({
      where: { id: wishlistId, userId },
    });
    if (!wishlist) throw new NotFoundException("Wishlist not found for this user.");

    await this.prisma.wishlistItem.deleteMany({
      where: { wishlistId, bookId },
    });

    return this.listBooks(userId, wishlistId);
  }

  // ✅ GET /users/:userId/wishlists/:wishlistId/books
  async listBooks(userId: number, wishlistId: number) {
    const wishlist = await this.prisma.wishlist.findFirst({
      where: { id: wishlistId, userId },
    });
    if (!wishlist) throw new NotFoundException("Wishlist not found for this user.");

    const items = await this.prisma.wishlistItem.findMany({
      where: { wishlistId },
      include: { book: true },
      orderBy: { bookId: "asc" },
    });

    return {
      wishlistId,
      name: wishlist.name,
      isPrimary: wishlist.isPrimary,
      books: items.map((i) => i.book),
    };
  }

  // ✅ POST /users/:userId/wishlists/move-book
  async moveBook(userId: number, bookId: number, fromWishlistId: number, toWishlistId: number) {
    if (fromWishlistId === toWishlistId) {
      throw new BadRequestException("fromWishlistId and toWishlistId cannot be the same.");
    }

    // Verify both belong to user
    const [from, to] = await Promise.all([
      this.prisma.wishlist.findFirst({ where: { id: fromWishlistId, userId } }),
      this.prisma.wishlist.findFirst({ where: { id: toWishlistId, userId } }),
    ]);

    if (!from) throw new NotFoundException("Source wishlist not found for this user.");
    if (!to) throw new NotFoundException("Destination wishlist not found for this user.");

    // Transaction: remove from old, add to new
    await this.prisma.$transaction(async (tx) => {
      await tx.wishlistItem.deleteMany({
        where: { wishlistId: fromWishlistId, bookId },
      });

      // create (ignore dup)
      try {
        await tx.wishlistItem.create({
          data: { wishlistId: toWishlistId, bookId },
        });
      } catch {
        // ignore duplicate
      }
    });

    return {
      moved: true,
      bookId,
      fromWishlistId,
      toWishlistId,
    };
  }
}
