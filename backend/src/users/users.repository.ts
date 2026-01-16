import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IUsersRepository } from "./users.repository.interface";

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private prisma: PrismaService) {}
  
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
