import { Module } from "@nestjs/common";
import { WishlistsController } from "./wishlists.controller";
import { WishlistsService } from "./wishlists.service";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [WishlistsController],
  providers: [WishlistsService, PrismaService],
})
export class WishlistsModule {}
