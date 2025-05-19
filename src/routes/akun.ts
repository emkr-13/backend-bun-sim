import { Router } from "express";
import {
  listAkuns,
  createAkun,
  deleteAkun,
  detailAkun,
  updateAkun,
} from "../controllers/akun.controller";
import { validateDto } from "../middleware/validationMiddleware";
import {
  CreateAkunDto,
  UpdateAkunDto,
  DeleteAkunDto,
  AkunDetailDto,
} from "../dtos/akun.dto";
import { authenticate } from "../middleware/authMiddleware";

/**
 * @swagger
 * tags:
 *   name: Akun
 *   description: Account management endpoints
 */
const router = Router();

/**
 * @swagger
 * /api/akun/all:
 *   get:
 *     summary: Get list of accounts
 *     tags: [Akun]
 *     security:
 *       - bearerAuth: []
 */
router.get("/all", authenticate, listAkuns);

/**
 * @swagger
 * /api/akun/create:
 *   post:
 *     summary: Create a new account
 *     tags: [Akun]
 *     security:
 *       - bearerAuth: []
 */
router.post("/create", authenticate, validateDto(CreateAkunDto), createAkun);

/**
 * @swagger
 * /api/akun/update:
 *   post:
 *     summary: Update an existing account
 *     tags: [Akun]
 *     security:
 *       - bearerAuth: []
 */
router.post("/update", authenticate, validateDto(UpdateAkunDto), updateAkun);

/**
 * @swagger
 * /api/akun/delete:
 *   post:
 *     summary: Delete an account
 *     tags: [Akun]
 *     security:
 *       - bearerAuth: []
 */
router.post("/delete", authenticate, validateDto(DeleteAkunDto), deleteAkun);

/**
 * @swagger
 * /api/akun/detail:
 *   post:
 *     summary: Get account details
 *     tags: [Akun]
 *     security:
 *       - bearerAuth: []
 */
router.post("/detail", authenticate, validateDto(AkunDetailDto), detailAkun);

export default router;
