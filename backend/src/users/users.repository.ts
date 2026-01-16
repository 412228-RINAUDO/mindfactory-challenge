import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IUsersRepository } from "./users.repository.interface";

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private prisma: PrismaService) {}
  
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: { name: string; email: string; password: string }) {
    return this.prisma.user.create({ data });
  }
}
