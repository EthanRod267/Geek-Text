export class CreateBookDto {
  isbn?: string;
  name?: string;
  description?: string;
  price?: number;
  author?: string;
  genre?: string;
  publisher?: string;
  yearPublished?: number;
  copiesSold?: number;
}
