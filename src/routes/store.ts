import { Router } from "express";
import { createStore,listStores,updateStore,deleteStore,detailStores } from "../controllers/storeController";

const router = Router();
// Rute untuk mendapatkan daftar departemen
router.get("/all", listStores);
// Rute untuk membuat departemen baru
router.post("/create", createStore);
// Rute untuk memperbarui departemen
router.post("/update", updateStore);
// Rute untuk menghapus departemen
router.post("/delete", deleteStore);
router.post("/detail", detailStores);

export default router;
