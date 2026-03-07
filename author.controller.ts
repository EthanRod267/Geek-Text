import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} 

from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/createAuthor.dto';
import { AdminGuard } from '../auth/guards/admin.guard'; // Implement this guard

@Controller('authors')
export class AuthorController {
  constructor(private authorService: AuthorService) {}

  /**
   * POST /authors
   * Administrator creates a new author
   * Parameters: Author Object (firstName, lastName, biography, publisher)
   * Response: None (HTTP 201 Created)
   */
  @Post()
  @UseGuards(AdminGuard) // Only administrators can create authors
  @HttpCode(HttpStatus.CREATED)
  async createAuthor(@Body() createAuthorDto: CreateAuthorDto): Promise<void> {
    await this.authorService.createAuthor(createAuthorDto);
    // No response data - only return status code 201
    return;
  }
}