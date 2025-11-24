import { authMiddleware } from '../middlewares/auth.js';
import jwt from 'jsonwebtoken';

describe('Auth Middleware', () => {
    let mockReq;
    let mockRes;
    let nextFunction;

    beforeEach(() => {
        mockReq = {
            headers: {},
            user: null
        };
        mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn()
        };
        nextFunction = jest.fn();
    });

    it('should return 401 if no token is provided', () => {
        authMiddleware(mockReq, mockRes, nextFunction);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'No token provided' });
        expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 if the token is invalid', () => {
        mockReq.headers.authorization = 'Bearer invalid_token';

        authMiddleware(mockReq, mockRes, nextFunction);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid token' });
        expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should set req.user and call next() if token is valid', () => {
        const user = { id: 1, rol: 3 };
        const token = jwt.sign(user, process.env.JWT_SECRET);
        mockReq.headers.authorization = `Bearer ${token}`;

        authMiddleware(mockReq, mockRes, nextFunction);

        expect(mockReq.user).toBeDefined();
        expect(mockReq.user.id).toBe(user.id);
        expect(mockReq.user.rol).toBe(user.rol);
        expect(nextFunction).toHaveBeenCalled();
    });

    it('should handle malformed authorization header', () => {
        mockReq.headers.authorization = 'InvalidFormat';

        authMiddleware(mockReq, mockRes, nextFunction);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid token' });
        expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should handle expired tokens', () => {
        const user = { id: 1, rol: 3 };
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '0s' });
        mockReq.headers.authorization = `Bearer ${token}`;

        // Wait for token to expire
        setTimeout(() => {
            authMiddleware(mockReq, mockRes, nextFunction);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid token' });
            expect(nextFunction).not.toHaveBeenCalled();
        }, 1000);
    });
});