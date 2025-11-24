import { Router } from "express";
import { authRequired } from "../middlewares/auth.js";
import { crearCita, misCitas, todasCitas, confirmarCita, cancelarCita, reagendarCita } 
from "../controllers/citas.controller.js";

const router = Router();

router.post("/", authRequired, crearCita);
router.get("/mias", authRequired, misCitas);

// ADMIN
router.get("/", authRequired, todasCitas);
router.put("/:id/confirmar", authRequired, confirmarCita);
router.put("/:id/cancelar", authRequired, cancelarCita);
router.put("/:id/reagendar", authRequired, reagendarCita);

export default router;
