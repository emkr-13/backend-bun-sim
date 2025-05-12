import { Router } from "express";
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
} from "../controllers/product.controller";

const router = Router();

// Rute untuk mendapatkan daftar kategori
router.get("/all", listProducts);
// // Rute untuk membuat kategori baru
router.post("/create", createProduct);
// // Rute untuk memperbarui kategori
router.post("/update", updateProduct);
// // Rute untuk menghapus kategori
router.post("/delete", deleteProduct);

router.post("/detail", getProductDetail);

export default router;
