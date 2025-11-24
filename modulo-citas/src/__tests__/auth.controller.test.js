import request from 'supertest';
import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { testPool, cleanDb, closePool } from '../config/test-db.js';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());

// Mount the routes we want to test
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

describe('Auth Controller', () => {
    beforeAll(async () => {
        // Ensure we're using the test database
        process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
    });

    beforeEach(async () => {
        await cleanDb();
    });

    afterAll(async () => {
        await closePool();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const newUser = {
                nombre: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                telefono: '1234567890'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(newUser);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Usuario registrado');

            // Verify the user was actually created in the database
            const result = await testPool.query(
                'SELECT * FROM usuarios WHERE email = $1',
                [newUser.email]
            );
            
            expect(result.rows).toHaveLength(1);
            expect(result.rows[0].nombre).toBe(newUser.nombre);
            expect(result.rows[0].email).toBe(newUser.email);
            
            // Verify password was hashed
            const validPassword = await bcrypt.compare(
                newUser.password,
                result.rows[0].password
            );
            expect(validPassword).toBe(true);
        });

        it('should not register a user with duplicate email', async () => {
            const user = {
                nombre: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                telefono: '1234567890'
            };

            // Register the user first time
            await request(app)
                .post('/api/auth/register')
                .send(user);

            // Try to register the same email again
            const response = await request(app)
                .post('/api/auth/register')
                .send(user);

            expect(response.status).toBe(500);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with correct credentials', async () => {
            // First register a user
            const user = {
                nombre: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                telefono: '1234567890'
            };

            await request(app)
                .post('/api/auth/register')
                .send(user);

            // Then try to login
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: user.email,
                    password: user.password
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        });

        it('should not login with incorrect password', async () => {
            // First register a user
            const user = {
                nombre: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                telefono: '1234567890'
            };

            await request(app)
                .post('/api/auth/register')
                .send(user);

            // Try to login with wrong password
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: user.email,
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Credenciales incorrectas');
        });

        it('should not login with non-existent email', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe el usuario');
        });
    });
});