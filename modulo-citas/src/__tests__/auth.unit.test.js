/**
 * @jest-environment node
 */

// Mock modules must be defined before imports
jest.mock('../config/db.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

// Import modules
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import * as authController from '../controllers/auth.controller.js';

describe('Auth Controller (Unit Tests)', () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Setup request and response mocks
        mockReq = {
            body: {}
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Setup database mock
        pool.query = jest.fn();

        // Setup default mock behaviors
        bcrypt.hash.mockResolvedValue('hashedpassword123');
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('test.jwt.token');
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            // Arrange
            mockReq.body = {
                nombre: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                telefono: '1234567890'
            };

            pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

            // Act
            await authController.register(mockReq, mockRes);

            // Assert
            expect(pool.query).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith({ 
                message: 'Usuario registrado' 
            });
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        });

        it('should handle database errors', async () => {
            // Arrange
            mockReq.body = {
                nombre: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                telefono: '1234567890'
            };

            pool.query.mockRejectedValueOnce(new Error('DB Error'));

            // Act
            await authController.register(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ error: expect.any(String) })
            );
        });
    });

    describe('login', () => {
        it('should login successfully with correct credentials', async () => {
            // Arrange
            const mockUser = {
                id: 1,
                email: 'test@example.com',
                password: 'hashedpassword',
                rol_id: 3
            };

            mockReq.body = {
                email: mockUser.email,
                password: 'password123'
            };

            pool.query.mockResolvedValueOnce({ rows: [mockUser] });
            bcrypt.compare.mockResolvedValueOnce(true);

            // Act
            await authController.login(mockReq, mockRes);

            // Assert
            expect(pool.query).toHaveBeenCalled();
            expect(bcrypt.compare).toHaveBeenCalled();
            expect(jwt.sign).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ token: expect.any(String) })
            );
        });

        it('should not login with non-existent user', async () => {
            // Arrange
            mockReq.body = {
                email: 'nonexistent@example.com',
                password: 'password123'
            };

            pool.query.mockResolvedValueOnce({ rows: [] });

            // Act
            await authController.login(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ 
                message: 'No existe el usuario' 
            });
        });

        it('should not login with incorrect password', async () => {
            // Arrange
            mockReq.body = {
                email: 'test@example.com',
                password: 'wrongpassword'
            };

            pool.query.mockResolvedValueOnce({
                rows: [{
                    id: 1,
                    email: 'test@example.com',
                    password: 'hashedpassword'
                }]
            });

            bcrypt.compare.mockResolvedValueOnce(false);

            // Act
            await authController.login(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ 
                message: 'Credenciales incorrectas' 
            });
        });
    });
});