import { IUserRepository } from "../repositories/userRepository";
import logger from "../utils/logger";

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async getProfile(userId: string) {
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      email: user.email,
      fullname: user.fullname,
      usercreated: user.createdAt,
    };
  }

  async editUser(userId: string, fullname: string) {
    if (!userId) {
      throw new Error("Unauthorized");
    }

    if (!fullname) {
      throw new Error("fullname is required");
    }

    const updatedUser = await this.userRepository.updateUser(userId, {
      fullname,
    });
    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  }
    async logout(userId: string) {
    if (!userId) {
      throw new Error("Unauthorized");
    }

    await this.userRepository.updateRefreshToken(userId, null, null);
    logger.info("Logout successful for user ID:", userId);
  }
}
