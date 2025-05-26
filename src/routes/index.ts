import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import categoriesRoutes from "./categories";
import storeRoutes from "./store";
import akunRoutes from "./akun";
import productsRoutes from "./products";
import quotationRoutes from "./quotation";
import purchaseRoutes from "./purchase";
import reportsRoutes from "./reports";
import dashboardRoutes from "./dashboard";
import stockMovementsRoutes from "./stockMovements";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();
const protectedRouter = Router();

// Public routes
router.use("/auth", authRoutes);

// Protected routes
protectedRouter.use("/user", userRoutes);
protectedRouter.use("/categories", categoriesRoutes);
protectedRouter.use("/store", storeRoutes);
protectedRouter.use("/akun", akunRoutes);
protectedRouter.use("/products", productsRoutes);
protectedRouter.use("/quotations", quotationRoutes);
protectedRouter.use("/purchases", purchaseRoutes);
protectedRouter.use("/reports", reportsRoutes);
protectedRouter.use("/dashboard", dashboardRoutes);
protectedRouter.use("/stock-movements", stockMovementsRoutes);

// Apply authentication middleware to all protected routes
router.use(authenticate, protectedRouter);

export default router;
