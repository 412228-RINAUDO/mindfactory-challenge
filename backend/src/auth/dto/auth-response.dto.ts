export class AuthUserDto {
  name: string;
  email: string;
}

export class AuthResponseDto {
  user: AuthUserDto;
  access_token: string;

  constructor(user: AuthUserDto, accessToken: string) {
    this.user = {
      name: user.name,
      email: user.email,
    };
    this.access_token = accessToken;
  }
}
