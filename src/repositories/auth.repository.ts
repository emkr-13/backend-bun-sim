import { db } from "../config/db";
import { users } from "../models/user";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<any>;
  findUserByRefreshToken(refreshToken: string): Promise<any>;
  updateRefreshToken(
    userId: string,
    refreshToken: string | null,
    refreshTokenExp: Date | null
  ): Promise<void>;
  verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
  createUser(data: {
    email: string;
    password: string;
    fullname: string;
  }): Promise<any>;
}

export class AuthRepository implements IAuthRepository {
  async findUserByEmail(email: string): Promise<any> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async findUserByRefreshToken(refreshToken: string): Promise<any> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.refreshToken, refreshToken));
    return user;
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

  async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
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
