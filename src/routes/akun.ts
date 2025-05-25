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
 * tags:
 *   name: Akun
 *   description: Account management endpoints
 */

// Get all accounts
router.get("/all", listAkuns);

// Create a new account
router.post("/create", validateDto(CreateAkunDto), createAkun);

// Update an account
router.post("/update", validateDto(UpdateAkunDto), updateAkun);

// Delete an account
router.post("/delete", validateDto(DeleteAkunDto), deleteAkun);

// Get account details
router.post("/detail", validateDto(AkunDetailDto), detailAkun);

export default router;
