import { db } from "../config/db";
import { users } from "../models/user";
import { eq } from "drizzle-orm";

export interface IUserRepository {
  findUserById(userId: string): Promise<any>;
  updateUser(userId: string, data: { fullname: string }): Promise<any>;
}

export class UserRepository implements IUserRepository {
  async findUserById(userId: string): Promise<any> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user;
  }

  async updateUser(userId: string, data: { fullname: string }): Promise<any> {
    const [updatedUser] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }
}