import request from 'supertest';
import express from 'express';
import { testPool, cleanDb, closePool } from '../config/test-db.js';

// We'll import controllers after setting up the test DB URL in beforeAll
let vehiculosController;

const app = express();
app.use(express.json());

// Mock auth middleware for testing
app.use((req, res, next) => {
    req.user = { id: 1, rol: 3 }; // Regular user role
    next();
});

// Routes will be mounted in beforeAll after we import the controller (so pool uses TEST DB)

describe('Vehiculos Controller', () => {
    beforeAll(async () => {
        process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
        // Ensure clean state and create test user
        await testPool.query('TRUNCATE TABLE usuarios, vehiculos, servicios, citas CASCADE');
            await testPool.query(`
                INSERT INTO usuarios (id, nombre, email, password, telefono, rol_id)
                VALUES (1, 'Test User', 'test@example.com', 'hashedpass', '1234567890', 3)
            `);

            // Import controller after DB env is set and seed data inserted
            vehiculosController = await import('../controllers/vehiculos.controller.js');

            // Mount routes now that controller is loaded
            app.get('/api/vehiculos', vehiculosController.getVehiculos);
            app.post('/api/vehiculos', vehiculosController.createVehiculo);
            app.get('/api/vehiculos/:id', vehiculosController.getVehiculo);
            app.put('/api/vehiculos/:id', vehiculosController.updateVehiculo);
            app.delete('/api/vehiculos/:id', vehiculosController.deleteVehiculo);
    });

    beforeEach(async () => {
        await testPool.query('TRUNCATE TABLE vehiculos CASCADE');
        // Insert test vehicle
        await testPool.query(`
            INSERT INTO vehiculos (id, marca, modelo, anio, placa, usuario_id)
            VALUES (1, 'Toyota', 'Corolla', 2020, 'ABC123', 1)
        `);
    });

    afterAll(async () => {
        await cleanDb();
        await closePool();
    });

    describe('GET /api/vehiculos', () => {
        it('should return all vehicles for the user', async () => {
            const response = await request(app)
                .get('/api/vehiculos');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toHaveProperty('marca', 'Toyota');
        });
    });

    describe('POST /api/vehiculos', () => {
        it('should create a new vehicle', async () => {
            const newVehicle = {
                marca: 'Honda',
                modelo: 'Civic',
                anio: 2021,
                placa: 'XYZ789'
            };

            const response = await request(app)
                .post('/api/vehiculos')
                .send(newVehicle);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id');
            expect(response.body.marca).toBe(newVehicle.marca);
        });

        it('should not create a vehicle without required fields', async () => {
            const invalidVehicle = {
                marca: 'Honda'
                // Missing required fields
            };

            const response = await request(app)
                .post('/api/vehiculos')
                .send(invalidVehicle);

            expect(response.status).toBe(500);
        });
    });

    describe('GET /api/vehiculos/:id', () => {
        it('should return a specific vehicle', async () => {
            const response = await request(app)
                .get('/api/vehiculos/1');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', 1);
            expect(response.body).toHaveProperty('marca', 'Toyota');
        });

        it('should return 404 for non-existent vehicle', async () => {
            const response = await request(app)
                .get('/api/vehiculos/999');

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /api/vehiculos/:id', () => {
        it('should update an existing vehicle', async () => {
            const updateData = {
                marca: 'Honda',
                modelo: 'Accord',
                anio: 2022,
                placa: 'NEW123'
            };

            const response = await request(app)
                .put('/api/vehiculos/1')
                .send(updateData);

            expect(response.status).toBe(200);

            // Verify the update
            const result = await testPool.query('SELECT * FROM vehiculos WHERE id = 1');
            expect(result.rows[0].marca).toBe(updateData.marca);
            expect(result.rows[0].modelo).toBe(updateData.modelo);
        });

        it('should not update vehicle of another user', async () => {
            // Create another user and their vehicle (use ON CONFLICT to avoid duplicate errors)
            await testPool.query(`
                INSERT INTO usuarios (id, nombre, email, password, telefono, rol_id)
                VALUES (2, 'Other User', 'other@example.com', 'hashedpass', '0987654321', 3)
                ON CONFLICT (id) DO NOTHING
            `);
            
            await testPool.query(`
                INSERT INTO vehiculos (id, marca, modelo, anio, placa, usuario_id)
                VALUES (2, 'Ford', 'Focus', 2019, 'DEF456', 2)
                ON CONFLICT (id) DO NOTHING
            `);

            const response = await request(app)
                .put('/api/vehiculos/2')
                .send({
                    marca: 'Updated',
                    modelo: 'Car',
                    anio: 2023,
                    placa: 'UPD123'
                });

            expect(response.status).toBe(403);
        });
    });

    describe('DELETE /api/vehiculos/:id', () => {
        it('should delete an existing vehicle', async () => {
            const response = await request(app)
                .delete('/api/vehiculos/1');

            expect(response.status).toBe(200);

            // Verify the deletion
            const result = await testPool.query('SELECT * FROM vehiculos WHERE id = 1');
            expect(result.rows).toHaveLength(0);
        });

        it('should not delete vehicle of another user', async () => {
            // Create another user and their vehicle (use ON CONFLICT to avoid duplicate errors)
            await testPool.query(`
                INSERT INTO usuarios (id, nombre, email, password, telefono, rol_id)
                VALUES (2, 'Other User', 'other@example.com', 'hashedpass', '0987654321', 3)
                ON CONFLICT (id) DO NOTHING
            `);
            
            await testPool.query(`
                INSERT INTO vehiculos (id, marca, modelo, anio, placa, usuario_id)
                VALUES (2, 'Ford', 'Focus', 2019, 'DEF456', 2)
                ON CONFLICT (id) DO NOTHING
            `);

            const response = await request(app)
                .delete('/api/vehiculos/2');

            expect(response.status).toBe(403);
        });
    });
});