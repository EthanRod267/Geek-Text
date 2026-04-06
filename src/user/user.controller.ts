import { Controller, Get, Post, Patch, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // POST /users - Create a new user
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  // GET /users/:username - Get user by username
  @Get(':username')
  async getUserByUsername(@Param('username') username: string) {
    return this.userService.getUserByUsername(username);
  }

  // PATCH /users/:username - Update user (cannot update email)
  @Patch(':username')
  async updateUser(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(username, updateUserDto);
  }

  // POST /users/:username/credit-cards - Create credit card for user
  @Post(':username/credit-cards')
  @HttpCode(HttpStatus.CREATED)
  async createCreditCard(
    @Param('username') username: string,
    @Body() createCreditCardDto: CreateCreditCardDto,
  ) {
    return this.userService.createCreditCard(username, createCreditCardDto);
  }
}
