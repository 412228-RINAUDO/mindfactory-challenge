import { Inject, Injectable } from '@nestjs/common';
import type { IUsersRepository } from './users.repository.interface';
import { USERS_REPOSITORY } from './users.tokens';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { UserNotFoundException } from '../common/exceptions/user-not-found.exception';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async findById(id: string) {
    const user = await this.usersRepository.findById(id);
    
    if (!user) {
      throw new UserNotFoundException(id);
    }
    
    return user;
  }

  async create(data: RegisterDto) {
    return this.usersRepository.create(data);
  }
}
