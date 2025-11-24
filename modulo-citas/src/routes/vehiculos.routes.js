import { Router } from "express";
import { authRequired } from "../middlewares/auth.js";
import { createVehiculo, getVehiculos } from "../controllers/vehiculos.controller.js";

const router = Router();

router.post("/", authRequired, createVehiculo);
router.get("/mios", authRequired, getVehiculos);

export default router;
