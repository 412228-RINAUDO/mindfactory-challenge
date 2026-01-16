import { Inject, Injectable } from '@nestjs/common';
import type { IUsersRepository } from './users.repository.interface';
import { USERS_REPOSITORY } from './users.tokens';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async create(data: { name: string; email: string; password: string }) {
    return this.usersRepository.create(data);
  }
}
