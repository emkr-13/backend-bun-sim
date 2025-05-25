import { db } from "../config/db";
import { users } from "../models/user";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IUserRepository {
  findUserById(userId: string): Promise<any>;
  updateRefreshToken(
    userId: string,
    refreshToken: string | null,
    refreshTokenExp: Date | null
  ): Promise<void>;
  updateUser(userId: string, data: { fullname: string }): Promise<any>;
  createUser(data: {
    email: string;
    password: string;
    fullname: string;
  }): Promise<any>;
  findUserByEmail(email: string): Promise<any>;
}

export class UserRepository implements IUserRepository {
  async findUserById(userId: string): Promise<any> {
    const [user] = await db
      .select({
        fullname: users.fullname,
        email: users.email,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId));
    return user;
  }

  async findUserByEmail(email: string): Promise<any> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
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

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
    refreshTokenExp: Date | null
  ): Promise<void> {
    await db
      .update(users)
      .set({
        refreshToken,
        refreshTokenExp,
      })
      .where(eq(users.id, userId));
  }

  async createUser(data: {
    email: string;
    password: string;
    fullname: string;
  }): Promise<any> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const [newUser] = await db
      .insert(users)
      .values({
        email: data.email,
        password: hashedPassword,
        fullname: data.fullname,
      })
      .returning();

    return newUser;
  }
}
