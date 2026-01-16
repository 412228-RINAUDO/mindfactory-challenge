import { User } from '../../generated/prisma/client';

export interface IUsersRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: { name: string; email: string; password: string }): Promise<User>;
  update(id: string, data: { name?: string; email?: string; password?: string }): Promise<User>;
}
