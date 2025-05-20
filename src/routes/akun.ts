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

const router = Router();

/**
 * @swagger
 * /api/akun/all:
 *   get:
 *     summary: Get list of accounts
 *     tags: [Akun]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of accounts retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/all", listAkuns);

/**
 * @swagger
 * /api/akun/create:
 *   post:
 *     summary: Create a new account
 *     tags: [Akun]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAkunDto'
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.post("/create", validateDto(CreateAkunDto), createAkun);

/**
 * @swagger
 * /api/akun/update:
 *   post:
 *     summary: Update an existing account
 *     tags: [Akun]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAkunDto'
 *     responses:
 *       200:
 *         description: Account updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Account not found
 *       500:
 *         description: Server error
 */
router.post("/update", validateDto(UpdateAkunDto), updateAkun);

/**
 * @swagger
 * /api/akun/delete:
 *   post:
 *     summary: Delete an account
 *     tags: [Akun]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteAkunDto'
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Account not found
 *       500:
 *         description: Server error
 */
router.post("/delete", validateDto(DeleteAkunDto), deleteAkun);

/**
 * @swagger
 * /api/akun/detail:
 *   post:
 *     summary: Get account details
 *     tags: [Akun]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AkunDetailDto'
 *     responses:
 *       200:
 *         description: Account details retrieved successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Account not found
 *       500:
 *         description: Server error
 */
router.post("/detail", validateDto(AkunDetailDto), detailAkun);

export default router;
