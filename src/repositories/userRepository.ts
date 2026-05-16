import { prisma } from "../lib/prisma.js";
import { type IUserRepository, type LoginData } from "../types.js";

export default class UserRepository implements IUserRepository {
  async createOne(data: {
    id: string;
    email: string;
    username: string;
    password: string;
  }) {
    const user = await prisma.users.create({ data });
    return user;
  }

  async getByEmail(email: string) {
    const user = await prisma.users.findFirst({
      where: {
        email,
        deleted_at: null,
      },
    });
    return user;
  }

  async getByUsername(username: string) {
    const user = await prisma.users.findFirst({
      where: {
        username,
        deleted_at: null,
      },
    });
    return user;
  }
}
