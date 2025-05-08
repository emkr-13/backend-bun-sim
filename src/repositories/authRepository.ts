import { db } from "../config/db";
import { users } from "../models/user";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<any>;
  updateRefreshToken(
    userId: string,
    refreshToken: string | null,
    refreshTokenExp: Date | null
  ): Promise<void>;
  verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
}

export class AuthRepository implements IAuthRepository {
  async findUserByEmail(email: string): Promise<any> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
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
}
