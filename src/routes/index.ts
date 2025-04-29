import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import categoriesRoutes from "./categories";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/categories", categoriesRoutes);


export default router;
