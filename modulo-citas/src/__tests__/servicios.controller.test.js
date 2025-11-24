import request from 'supertest';
import express from 'express';
import { testPool, cleanDb, closePool } from '../config/test-db.js';

let serviciosController;

const app = express();
app.use(express.json());

// Mock auth middleware for testing
app.use((req, res, next) => {
    req.user = { id: 1, rol: 1 }; // Admin role for service management
    next();
});

// Routes will be mounted in beforeAll after controller is imported

describe('Servicios Controller', () => {
    beforeAll(async () => {
        process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
    });

    beforeAll(async () => {
        // Ensure clean state and import controller after DB env is set
        await testPool.query('TRUNCATE TABLE servicios CASCADE');
        serviciosController = await import('../controllers/servicios.controller.js');

        // Mount routes now
        app.get('/api/servicios', serviciosController.getServicios);
        app.post('/api/servicios', serviciosController.createServicio);
        app.put('/api/servicios/:id', serviciosController.updateServicio);
        app.delete('/api/servicios/:id', serviciosController.deleteServicio);
    });

    beforeEach(async () => {
        await cleanDb();
        // Insert a test service
        await testPool.query(`
            INSERT INTO servicios (id, nombre, descripcion, precio, duracion)
            VALUES (1, 'Test Service', 'Test Description', 100.00, 60)
        `);
    });

    afterAll(async () => {
        await closePool();
    });

    describe('GET /api/servicios', () => {
        it('should return all services', async () => {
            const response = await request(app)
                .get('/api/servicios');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toHaveProperty('nombre', 'Test Service');
        });
    });

    describe('POST /api/servicios', () => {
        it('should create a new service', async () => {
            const newService = {
                nombre: 'Oil Change',
                descripcion: 'Complete oil change service',
                precio: 50.00,
                duracion: 30
            };

            const response = await request(app)
                .post('/api/servicios')
                .send(newService);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id');
            expect(response.body.nombre).toBe(newService.nombre);
        });

        it('should not create a service without required fields', async () => {
            const invalidService = {
                nombre: 'Invalid Service'
                // Missing required fields
            };

            const response = await request(app)
                .post('/api/servicios')
                .send(invalidService);

            expect(response.status).toBe(500);
        });
    });

    describe('PUT /api/servicios/:id', () => {
        it('should update an existing service', async () => {
            const updateData = {
                nombre: 'Updated Service',
                descripcion: 'Updated Description',
                precio: 150.00,
                duracion: 45
            };

            const response = await request(app)
                .put('/api/servicios/1')
                .send(updateData);

            expect(response.status).toBe(200);

            // Verify the update
            const result = await testPool.query('SELECT * FROM servicios WHERE id = 1');
            expect(result.rows[0].nombre).toBe(updateData.nombre);
            expect(result.rows[0].precio).toBe(updateData.precio);
        });

        it('should return 404 for non-existent service', async () => {
            const response = await request(app)
                .put('/api/servicios/999')
                .send({
                    nombre: 'Non-existent Service',
                    descripcion: 'Test',
                    precio: 100,
                    duracion: 30
                });

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /api/servicios/:id', () => {
        it('should delete an existing service', async () => {
            const response = await request(app)
                .delete('/api/servicios/1');

            expect(response.status).toBe(200);

            // Verify the deletion
            const result = await testPool.query('SELECT * FROM servicios WHERE id = 1');
            expect(result.rows).toHaveLength(0);
        });

        it('should return 404 for non-existent service', async () => {
            const response = await request(app)
                .delete('/api/servicios/999');

            expect(response.status).toBe(404);
        });
    });
});