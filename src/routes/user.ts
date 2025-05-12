import { Router } from "express";
import { editUser, getProfile, logout } from "../controllers/user.controller";

const router = Router();

// Rute untuk mendapatkan profil user
router.get("/detail", getProfile);
router.post("/logout", logout);
// Rute untuk mengedit user
router.post("/edit", editUser);

export default router;
