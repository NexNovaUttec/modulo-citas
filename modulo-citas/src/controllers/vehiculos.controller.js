import { pool } from "../config/db.js";

// List vehicles for the authenticated user
export const getVehiculos = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM vehiculos WHERE usuario_id = $1",
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a vehicle for the authenticated user
export const createVehiculo = async (req, res) => {
    try {
        const { marca, modelo, anio, placa } = req.body;
        const result = await pool.query(
            `INSERT INTO vehiculos (usuario_id, marca, modelo, anio, placa)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [req.user.id, marca, modelo, anio, placa]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single vehicle by id
export const getVehiculo = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM vehiculos WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'No existe el vehículo' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a vehicle (only owner allowed)
export const updateVehiculo = async (req, res) => {
    try {
        const { id } = req.params;
        const { marca, modelo, anio, placa } = req.body;

        // Verify ownership
        const ownerCheck = await pool.query('SELECT usuario_id FROM vehiculos WHERE id = $1', [id]);
        if (ownerCheck.rows.length === 0) return res.status(404).json({ message: 'No existe el vehículo' });
        if (ownerCheck.rows[0].usuario_id !== req.user.id && req.user.rol !== 1) {
            return res.status(403).json({ message: 'No autorizado' });
        }

        await pool.query(
            `UPDATE vehiculos SET marca = $1, modelo = $2, anio = $3, placa = $4 WHERE id = $5`,
            [marca, modelo, anio, placa, id]
        );

        res.json({ message: 'Vehículo actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a vehicle (only owner allowed)
export const deleteVehiculo = async (req, res) => {
    try {
        const { id } = req.params;
        const ownerCheck = await pool.query('SELECT usuario_id FROM vehiculos WHERE id = $1', [id]);
        if (ownerCheck.rows.length === 0) return res.status(404).json({ message: 'No existe el vehículo' });
        if (ownerCheck.rows[0].usuario_id !== req.user.id && req.user.rol !== 1) {
            return res.status(403).json({ message: 'No autorizado' });
        }

        await pool.query('DELETE FROM vehiculos WHERE id = $1', [id]);
        res.json({ message: 'Vehículo eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
