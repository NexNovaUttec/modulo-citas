import { pool } from "../config/db.js";

export const getServicios = async (req, res) => {
    const result = await pool.query("SELECT * FROM servicios");
    res.json(result.rows);
};

export const createServicio = async (req, res) => {
    try {
        const { nombre, descripcion, precio, duracion } = req.body;
        const result = await pool.query(
            `INSERT INTO servicios (nombre, descripcion, precio, duracion)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [nombre, descripcion, precio, duracion]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, duracion } = req.body;
        const exists = await pool.query('SELECT id FROM servicios WHERE id = $1', [id]);
        if (exists.rows.length === 0) return res.status(404).json({ message: 'No existe el servicio' });

        await pool.query(
            `UPDATE servicios SET nombre = $1, descripcion = $2, precio = $3, duracion = $4 WHERE id = $5`,
            [nombre, descripcion, precio, duracion, id]
        );
        res.json({ message: 'Servicio actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const exists = await pool.query('SELECT id FROM servicios WHERE id = $1', [id]);
        if (exists.rows.length === 0) return res.status(404).json({ message: 'No existe el servicio' });

        await pool.query('DELETE FROM servicios WHERE id = $1', [id]);
        res.json({ message: 'Servicio eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
