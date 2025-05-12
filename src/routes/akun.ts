import { Router } from "express";
import { listAkuns ,createAkun,deleteAkun,detailAkun,updateAkun} from "../controllers/akun.controller";

const router = Router();

router.get("/all", listAkuns);
router.post("/create", createAkun);
router.post("/update", updateAkun);
router.post("/delete", deleteAkun);
router.post("/detail", detailAkun);

export default router;