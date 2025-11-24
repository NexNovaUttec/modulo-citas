import dotenv from 'dotenv';

// Cargar variables de entorno de prueba
dotenv.config({ path: '.env.test' });

// Configuración global de Jest
global.beforeAll(() => {
    // Aquí podríamos agregar más configuraciones globales
});

// Limpiar mocks después de cada prueba
afterEach(() => {
    jest.clearAllMocks();
});