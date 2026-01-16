import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { IUsersRepository } from './users.repository.interface';
import { USERS_REPOSITORY } from './users.tokens';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserNotFoundException } from '../common/exceptions/user-not-found.exception';
import { EmailAlreadyExistsException } from '../common/exceptions/email-already-exists.exception';

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

  async update(id: string, data: UpdateUserDto) {
    await this.findById(id);

    if (data.email) {
      const existingUser = await this.usersRepository.findByEmail(data.email);
      if (existingUser) {
        throw new EmailAlreadyExistsException();
      }
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return this.usersRepository.update(id, data);
  }
}
