import { User } from '../../../generated/prisma/client';

export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  created_at: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.created_at = user.createdAt;
  }
}
