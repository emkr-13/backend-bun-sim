import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import categoriesRoutes from "./categories";
import storeRoutes from "./store";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", authenticate, userRoutes);
router.use("/categories", authenticate, categoriesRoutes);
router.use("/departments", authenticate, storeRoutes);

export default router;
