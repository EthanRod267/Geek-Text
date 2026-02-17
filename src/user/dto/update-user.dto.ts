export class UpdateUserDto {
  username?: string;
  password?: string;
  email?: string; // This will be ignored in the service per requirements
  name?: string;
  address?: string;
}
