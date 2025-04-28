import { db } from "../config/db";
import { users } from "../models/user";
import { eq } from "drizzle-orm";
import { sendResponse } from "../utils/responseHelper";
import { Request, Response } from "express";
import logger from "../utils/logger";

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.id; // Ambil user ID dari token yang sudah diverifikasi

    if (!userId) {
      logger.error("Unauthorized: User ID not found");
      sendResponse(res, 400, "Unauthorized");

    }
    // Cari user berdasarkan ID
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    // Jika user tidak ditemukan
    if (!user) {
      sendResponse(res, 404, "User not found");
      logger.error("User not found");
      return;
    }
    let datauser = {
      email: user.email,
      fullname: user.fullname,
      usercreated: user.createdAt,
    };
    // Kirim response dengan data user
    sendResponse(res, 200, "User profile retrieved successfully", datauser);
    logger.info("User profile retrieved successfully");
  } catch (error) {
    logger.error("Error retrieving profile:", error);
    sendResponse(res, 500, "Internal server error");
  }
};

export const editUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    if (!userId) {
      sendResponse(res, 400, "Unauthorized");
      logger.error("Unauthorized: User ID not found");
    } // Ambil user ID dari token yang sudah diverifikasi
    const { fullname } = req.body; // Ambil data dari request body

    // Validasi input
    if (!fullname) {
      sendResponse(res, 400, "fullname is required");
      logger.error("Validation error: fullname is required");
      return;
    }

    // Update user di database
    const updatedUser = await db
      .update(users)
      .set({ fullname })
      .where(eq(users.id, userId));

    // Jika user tidak ditemukan
    if (!updatedUser) {
      sendResponse(res, 404, "User not found");
      logger.error("User not found");
      return;
    }

    // Kirim response sukses
    sendResponse(res, 200, "User updated successfully");
    logger.info("User updated successfully");
  } catch (error) {
    logger.error("Error editing user:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
