import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  detailCategory
} from "../controllers/categoriesController";

const router = Router();

// Rute untuk mendapatkan daftar kategori
router.get("/all", authenticate, listCategories);
// // Rute untuk membuat kategori baru
router.post("/create", authenticate, createCategory);
// // Rute untuk memperbarui kategori
router.post("/update", authenticate, updateCategory);
// // Rute untuk menghapus kategori
router.post("/delete", authenticate, deleteCategory);

router.post("/detail", authenticate, detailCategory);


export default router;