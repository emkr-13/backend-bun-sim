import { Router } from "express";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  detailCategory,
} from "../controllers/categories.controller";

const router = Router();

// Rute untuk mendapatkan daftar kategori
router.get("/all", listCategories);
// // Rute untuk membuat kategori baru
router.post("/create", createCategory);
// // Rute untuk memperbarui kategori
router.post("/update", updateCategory);
// // Rute untuk menghapus kategori
router.post("/delete", deleteCategory);

router.post("/detail", detailCategory);

export default router;
