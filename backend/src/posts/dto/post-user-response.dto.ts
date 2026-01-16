import { User } from '../../../generated/prisma/client';

export class PostUserResponseDto {
  id: string;
  name: string;
  email: string;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
  }
}
