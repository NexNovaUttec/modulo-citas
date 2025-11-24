import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

// Load test environment variables
dotenv.config({ path: '.env.test' });

export const testPool = new Pool({
    connectionString: process.env.TEST_DATABASE_URL || 'postgresql://postgres:root@localhost:5432/minerva_test'
});

// Helper function to clean the test database
export const cleanDb = async () => {
    const tables = ['usuarios', 'citas', 'vehiculos', 'servicios'];
    for (const table of tables) {
        await testPool.query(`TRUNCATE TABLE ${table} CASCADE`);
    }
};

// Close pool (useful for after tests)
export const closePool = async () => {
    await testPool.end();
};