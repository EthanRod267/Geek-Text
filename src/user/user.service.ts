import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Create a new user
  async createUser(createUserDto: CreateUserDto) {
    const { username, password, email, name, address } = createUserDto;

    // Check if username already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Check if email already exists
    if (email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    // Create the user
    const user = await this.prisma.user.create({
      data: {
        username,
        password, // In production, you should hash this!
        email: email || `${username}@temp.com`, // Email is required in schema
        name,
        address,
      },
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Get user by username
  async getUserByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        creditCards: true,
        cart: {
          include: {
            items: {
              include: {
                book: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with username '${username}' not found`);
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Update user (cannot update email)
  async updateUser(username: string, updateUserDto: UpdateUserDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`User with username '${username}' not found`);
    }

    // Remove email from update data if present (per requirements)
    const { email, ...updateData } = updateUserDto;

    // Update the user
    const updatedUser = await this.prisma.user.update({
      where: { username },
      data: updateData,
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  // Create credit card for a user
  async createCreditCard(username: string, createCreditCardDto: CreateCreditCardDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`User with username '${username}' not found`);
    }

    // Create credit card
    const creditCard = await this.prisma.creditCard.create({
      data: {
        userId: user.id,
        ...createCreditCardDto,
      },
    });

    return creditCard;
  }
}
