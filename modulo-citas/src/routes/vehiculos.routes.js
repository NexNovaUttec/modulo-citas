import { Router } from "express";
import { authRequired } from "../middlewares/auth.js";
import { crearVehiculo, misVehiculos } from "../controllers/vehiculos.controller.js";

const router = Router();

router.post("/", authRequired, crearVehiculo);
router.get("/mios", authRequired, misVehiculos);

export default router;
