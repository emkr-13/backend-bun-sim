import { IAuthRepository } from "../repositories/auth.repository";
import { generateJwtToken, generateRefreshToken } from "../utils/helper";
import logger from "../utils/logger";

export class AuthService {
  constructor(private readonly authRepository: IAuthRepository) {}

  async login(email: string, password: string) {
    // Validate input
    if (!email || !password) {
      throw new Error("email and password are required");
    }

    // Find user
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Verify password
    const isPasswordValid = await this.authRepository.verifyPassword(
      password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Generate tokens
    const jwtResponse = await generateJwtToken({ id: user.id });
    const authToken = jwtResponse.token ?? "";

    const refreshTokenResponse = await generateRefreshToken({ id: user.id });
    const refreshToken = refreshTokenResponse.token ?? "";

    if (!refreshToken) {
      throw new Error("Refresh token generation failed");
    }

    // Update refresh token in database
    const refreshTokenExp = new Date(
      Date.now() + parseInt(process.env.REFRESH_TOKEN_EXP!) * 1000
    );

    await this.authRepository.updateRefreshToken(
      user.id,
      refreshToken,
      refreshTokenExp
    );

    logger.info("Login successful for user: ", user.email);

    return {
      token: authToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    // Validate input
    if (!refreshToken) {
      throw new Error("Refresh token is required");
    }

    // Verify refresh token
    const user = await this.authRepository.findUserByRefreshToken(refreshToken);
    if (!user) {
      throw new Error("Invalid refresh token");
    }

    // Check if refresh token is expired
    if (user.refreshTokenExp && new Date(user.refreshTokenExp) < new Date()) {
      throw new Error("Refresh token expired");
    }

    // Generate new tokens
    const jwtResponse = await generateJwtToken({ id: user.id });
    const authToken = jwtResponse.token ?? "";

    const refreshTokenResponse = await generateRefreshToken({ id: user.id });
    const newRefreshToken = refreshTokenResponse.token ?? "";

    if (!newRefreshToken) {
      throw new Error("Refresh token generation failed");
    }

    // Update refresh token in database
    const refreshTokenExp = new Date(
      Date.now() + parseInt(process.env.REFRESH_TOKEN_EXP!) * 1000
    );

    await this.authRepository.updateRefreshToken(
      user.id,
      newRefreshToken,
      refreshTokenExp
    );

    logger.info("Token refreshed successfully for user ID: ", user.id);

    return {
      token: authToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string) {
    // Validate input
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Clear refresh token
    await this.authRepository.updateRefreshToken(userId, null, null);

    logger.info("Logout successful for user ID: ", userId);
  }
}
