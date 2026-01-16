import { User } from '../../generated/prisma/client';

export interface IUsersRepository {
  findByEmail(email: string): Promise<User | null>;
}
