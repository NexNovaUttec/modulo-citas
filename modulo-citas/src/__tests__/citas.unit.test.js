import * as citasController from '../controllers/citas.controller.js';

// Mock de la base de datos
const mockPool = {
    query: jest.fn()
};

// Mock del objeto request
const mockReq = {
    user: { id: 1, rol: 3 },
    body: {},
    params: {}
};

// Mock del objeto response
const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};

// Reemplazar el pool real con nuestro mock
jest.mock('../config/db.js', () => ({
    pool: mockPool
}));

describe('Citas Controller (Unit Tests)', () => {
    beforeEach(() => {
        // Limpiar todos los mocks antes de cada prueba
        jest.clearAllMocks();
        mockRes.status.mockClear();
        mockRes.json.mockClear();
    });

    describe('createCita', () => {
        it('should create a new appointment successfully', async () => {
            // Preparar
            const citaData = {
                fecha: '2025-12-01',
                hora: '10:00',
                vehiculo_id: 1,
                servicio_id: 1,
                notas: 'Test appointment'
            };
            mockReq.body = citaData;
            
            // Simular respuesta exitosa de la base de datos
            mockPool.query.mockResolvedValueOnce({
                rows: [{ id: 1, ...citaData }]
            });

            // Ejecutar
            await citasController.createCita(mockReq, mockRes);

            // Verificar
            expect(mockPool.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO citas'),
                expect.arrayContaining([
                    citaData.fecha,
                    citaData.hora,
                    citaData.vehiculo_id,
                    citaData.servicio_id,
                    mockReq.user.id
                ])
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ id: 1 })
            );
        });

        it('should handle database errors', async () => {
            // Preparar
            mockReq.body = {
                fecha: '2025-12-01',
                hora: '10:00',
                vehiculo_id: 1,
                servicio_id: 1
            };
            
            // Simular error de base de datos
            mockPool.query.mockRejectedValueOnce(new Error('DB Error'));

            // Ejecutar
            await citasController.createCita(mockReq, mockRes);

            // Verificar
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ error: expect.any(String) })
            );
        });
    });

    describe('getCitas', () => {
        it('should return all appointments for a user', async () => {
            // Preparar
            const mockCitas = [
                { id: 1, fecha: '2025-12-01', hora: '10:00' },
                { id: 2, fecha: '2025-12-02', hora: '11:00' }
            ];
            mockPool.query.mockResolvedValueOnce({ rows: mockCitas });

            // Ejecutar
            await citasController.getCitas(mockReq, mockRes);

            // Verificar
            expect(mockPool.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT'),
                [mockReq.user.id]
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockCitas);
        });
    });

    describe('getCita', () => {
        it('should return a specific appointment', async () => {
            // Preparar
            const mockCita = {
                id: 1,
                fecha: '2025-12-01',
                hora: '10:00'
            };
            mockReq.params = { id: '1' };
            mockPool.query.mockResolvedValueOnce({ rows: [mockCita] });

            // Ejecutar
            await citasController.getCita(mockReq, mockRes);

            // Verificar
            expect(mockPool.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT'),
                [mockReq.params.id, mockReq.user.id]
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockCita);
        });

        it('should return 404 for non-existent appointment', async () => {
            // Preparar
            mockReq.params = { id: '999' };
            mockPool.query.mockResolvedValueOnce({ rows: [] });

            // Ejecutar
            await citasController.getCita(mockReq, mockRes);

            // Verificar
            expect(mockRes.status).toHaveBeenCalledWith(404);
        });
    });

    describe('updateCita', () => {
        it('should update an appointment', async () => {
            // Preparar
            const updateData = {
                fecha: '2025-12-02',
                hora: '11:00'
            };
            mockReq.params = { id: '1' };
            mockReq.body = updateData;
            mockPool.query.mockResolvedValueOnce({ rows: [{ id: 1, ...updateData }] });

            // Ejecutar
            await citasController.updateCita(mockReq, mockRes);

            // Verificar
            expect(mockPool.query).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining(updateData)
            );
        });
    });

    describe('deleteCita', () => {
        it('should delete an appointment', async () => {
            // Preparar
            mockReq.params = { id: '1' };
            mockPool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

            // Ejecutar
            await citasController.deleteCita(mockReq, mockRes);

            // Verificar
            expect(mockPool.query).toHaveBeenCalledWith(
                expect.stringContaining('DELETE'),
                [mockReq.params.id, mockReq.user.id]
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });
    });
});