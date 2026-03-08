import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuthorDto } from 'src/author/dto/createAuthor.dto';
import { AuthorResponseDto } from 'src/author/dto/authorResponse.dto';


@Injectable()
export class AuthorService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new author
   * @param createAuthorDto - Author information (firstName, lastName, biography, publisher)
   * @returns Created author object
   */
  async createAuthor(createAuthorDto: CreateAuthorDto): Promise<AuthorResponseDto> {
    try {
      // Validate required fields
      if (!createAuthorDto.firstName || !createAuthorDto.firstName.trim()) {
        throw new BadRequestException('First name is required');
      }
      if (!createAuthorDto.lastName || !createAuthorDto.lastName.trim()) {
        throw new BadRequestException('Last name is required');
      }
      if (!createAuthorDto.publisher || !createAuthorDto.publisher.trim()) {
        throw new BadRequestException('Publisher is required');
      }

      const author = await this.prisma.author.create({
        data: {
          firstName: createAuthorDto.firstName.trim(),
          lastName: createAuthorDto.lastName.trim(),
          biography: createAuthorDto.biography?.trim() || null,
          publisher: createAuthorDto.publisher.trim(),
        },
      });

      return author;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to create author: ${error.message}`);
    }
  }
}