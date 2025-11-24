import { pool } from "../config/db.js";

export const crearCita = async (req, res) => {
    try {
        const { vehiculo_id, servicio_id, fecha, hora, notas } = req.body;
        console.log('Creating appointment:', { vehiculo_id, servicio_id, fecha, hora, notas });

        // Validar campos requeridos
        if (!vehiculo_id || !servicio_id || !fecha || !hora) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Verificar si ya existe cita en ese horario
        const existe = await pool.query(
            `SELECT * FROM citas 
             WHERE fecha = $1 AND hora = $2 AND estado != 'cancelada'`,
            [fecha, hora]
        );

        console.log('Checking existing appointments:', existe.rows);
        if (existe.rows.length > 0)
            return res.status(400).json({ message: "Horario no disponible" });

        await pool.query(
            `INSERT INTO citas (usuario_id, vehiculo_id, servicio_id, fecha, hora, notas)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [req.user.id, vehiculo_id, servicio_id, fecha, hora, notas]
        );

        res.json({ message: "Cita solicitada" });
    } catch (err) {
        console.error('Error creating appointment:', err);
        res.status(500).json({ error: err.message });
    }
};

export const misCitas = async (req, res) => {
    const result = await pool.query(
        `SELECT c.*, s.nombre AS servicio
         FROM citas c
         JOIN servicios s ON s.id = c.servicio_id
         WHERE usuario_id = $1`,
        [req.user.id]
    );

    res.json(result.rows);
};

export const todasCitas = async (req, res) => {
    const result = await pool.query(
        `SELECT c.*, u.nombre AS cliente, s.nombre AS servicio
         FROM citas c
         JOIN usuarios u ON u.id = c.usuario_id
         JOIN servicios s ON s.id = c.servicio_id
         ORDER BY c.fecha, c.hora`
    );

    res.json(result.rows);
};

export const confirmarCita = async (req, res) => {
    await pool.query(
        "UPDATE citas SET estado = 'confirmada' WHERE id = $1",
        [req.params.id]
    );

    res.json({ message: "Cita confirmada" });
};

export const cancelarCita = async (req, res) => {
    await pool.query(
        "UPDATE citas SET estado = 'cancelada' WHERE id = $1",
        [req.params.id]
    );

    res.json({ message: "Cita cancelada" });
};

export const reagendarCita = async (req, res) => {
    const { fecha, hora } = req.body;

    const existe = await pool.query(
        `SELECT * FROM citas WHERE fecha = $1 AND hora = $2`,
        [fecha, hora]
    );

    if (existe.rows.length > 0)
        return res.status(400).json({ message: "Horario ocupado" });

    await pool.query(
        `UPDATE citas SET fecha = $1, hora = $2 WHERE id = $3`,
        [fecha, hora, req.params.id]
    );

    res.json({ message: "Cita reagendada" });
};
