import { User } from "generated/prisma";

export class AuthUserDto {
  id: string;
  name: string;
  email: string;
  created_at: Date;
}

export class AuthResponseDto {
  user: AuthUserDto;
  access_token: string;

  constructor(user: User, accessToken: string) {
    this.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.createdAt,
    };
    this.access_token = accessToken;
  }
}
