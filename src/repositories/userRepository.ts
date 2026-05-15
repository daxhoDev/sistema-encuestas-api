import { prisma } from "../lib/prisma.js";
import { type IUserRepository } from "../types.js";

export default class UserRepository implements IUserRepository {
  async createOne(data: { email: string; username: string; password: string }) {
    const user = await prisma.users.create({ data });
    return user;
  }
}
