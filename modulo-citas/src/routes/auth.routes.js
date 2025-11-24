import { Router } from "express";
import { login, register, registerAdmin } from "../controllers/auth.controller.js";
import { authRequired, isAdmin } from "../middlewares/auth.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);

// Endpoint para registrar administradores
// Si no hay admins, permite crear el primero sin autenticación
// Si ya hay admins, requiere que un admin existente autorice
router.post("/register-admin", (req, res, next) => {
    // Intentar extraer el token si existe
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
        // Si hay token, validarlo
        authRequired(req, res, () => {
            isAdmin(req, res, next);
        });
    } else {
        // Si no hay token, continuar (se validará en el controlador)
        next();
    }
}, registerAdmin);

export default router;
