import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

export const register = async (req, res) => {
    try {
        const { nombre, email, password, telefono } = req.body;

        const hashed = await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO usuarios (nombre, email, password, telefono, rol_id)
             VALUES ($1, $2, $3, $4, $5)`,
            [nombre, email, hashed, telefono, 3]  // 🔥 Correcto
        );

        res.json({ message: "Usuario registrado" });
    } catch (err) {
        console.log("❌ ERROR REGISTER:", err);
        res.status(500).json({ error: err.message });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM usuarios WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ message: "No existe el usuario" });

        const user = result.rows[0];

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ message: "Credenciales incorrectas" });

        const token = jwt.sign(
            {
                id: user.id,
                rol: user.rol_id
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const registerAdmin = async (req, res) => {
    try {
        const { nombre, email, password, telefono } = req.body;

        // Verificar si ya existe un administrador
        const adminCheck = await pool.query(
            "SELECT COUNT(*) as count FROM usuarios WHERE rol_id = 1"
        );

        // Si ya existe al menos un admin, verificar que quien hace la petición sea admin
        if (parseInt(adminCheck.rows[0].count) > 0 && (!req.user || req.user.rol !== 1)) {
            return res.status(403).json({ 
                message: "Solo un administrador puede crear otros administradores" 
            });
        }

        // Verificar si el email ya existe
        const userExists = await pool.query(
            "SELECT * FROM usuarios WHERE email = $1",
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "El email ya está registrado" });
        }

        const hashed = await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO usuarios (nombre, email, password, telefono, rol_id)
             VALUES ($1, $2, $3, $4, $5)`,
            [nombre, email, hashed, telefono, 1]  // rol_id = 1 para admin
        );

        res.json({ message: "Administrador registrado exitosamente" });
    } catch (err) {
        console.log("❌ ERROR REGISTER ADMIN:", err);
        res.status(500).json({ error: err.message });
    }
};
