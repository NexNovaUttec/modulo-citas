import request from 'supertest';
import express from 'express';

// Mock del módulo de base de datos
jest.mock('../config/db.js', () => {
    const mockPool = { query: jest.fn() };
    return { pool: mockPool };
});

// Import después del mock
import * as citasController from '../controllers/citas.controller.js';
import { pool } from '../config/db.js';

const app = express();
app.use(express.json());

// Mock auth middleware for testing
app.use((req, res, next) => {
    req.user = { id: 1, rol: 3 }; // Mock authenticated user
    next();
});

// Mount routes
app.get('/api/citas', citasController.misCitas);
app.post('/api/citas', citasController.crearCita);
app.get('/api/citas/todas', citasController.todasCitas);

describe('Citas Controller', () => {
    beforeAll(async () => {
        process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
    });

    beforeEach(() => {
        // Limpiar todos los mocks antes de cada prueba
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.resetModules();
    });

    describe('POST /api/citas (crearCita)', () => {
        it('should create a new appointment', async () => {
            const newCita = {
                fecha: '2025-12-01',
                hora: '10:00',
                vehiculo_id: 1,
                servicio_id: 1,
                notas: 'Test appointment'
            };

            // Mock verificación de cita existente
            pool.query
                .mockResolvedValueOnce({ rows: [] })  // No hay citas existentes
                .mockResolvedValueOnce({ rows: [{ id: 1 }] });  // Cita creada exitosamente

            const response = await request(app)
                .post('/api/citas')
                .send(newCita);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Cita solicitada');
        });

        it('should not create appointment with invalid date', async () => {
            const invalidCita = {
                fecha: 'invalid-date',
                hora: '10:00',
                vehiculo_id: 1,
                servicio_id: 1
            };

            // Mock error de fecha inválida
            pool.query.mockRejectedValueOnce(new Error('Invalid date'));

            const response = await request(app)
                .post('/api/citas')
                .send(invalidCita);

            expect(response.status).toBe(500);
        });

        it('should not create appointment if time slot is taken', async () => {
            const cita = {
                fecha: '2025-12-01',
                hora: '10:00',
                vehiculo_id: 1,
                servicio_id: 1
            };

            // Mock que encuentra una cita existente
            pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

            // Try to create another appointment at the same time
            const response = await request(app)
                .post('/api/citas')
                .send(cita);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Horario no disponible');
        });
    });

    describe('GET /api/citas (misCitas)', () => {
        beforeEach(async () => {
            // Mock respuesta de citas
            pool.query.mockResolvedValueOnce({
                rows: [{
                    id: 1,
                    fecha: '2025-12-01',
                    hora: '10:00',
                    vehiculo_id: 1,
                    servicio_id: 1,
                    usuario_id: 1,
                    servicio: 'Test Service'
                }]
            });
        });

        it('should return all appointments for user', async () => {
            const response = await request(app)
                .get('/api/citas');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toHaveProperty('servicio');
        });
    });

    describe('GET /api/citas/todas (todasCitas)', () => {
        beforeEach(async () => {
            // Mock respuesta de todas las citas
            pool.query.mockResolvedValueOnce({
                rows: [{
                    id: 1,
                    fecha: '2025-12-01',
                    hora: '10:00',
                    vehiculo_id: 1,
                    servicio_id: 1,
                    usuario_id: 1,
                    cliente: 'Test User',
                    servicio: 'Test Service'
                }]
            });
        });

        it('should return all appointments with client and service info', async () => {
            const response = await request(app)
                .get('/api/citas/todas');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toHaveProperty('cliente');
            expect(response.body[0]).toHaveProperty('servicio');
        });
    });
});