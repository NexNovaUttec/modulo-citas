-- Crear la base de datos de prueba
CREATE DATABASE minerva_test;

-- Conectar a la base de datos de prueba
\c minerva_test;

-- Crear las tablas necesarias
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    rol_id INTEGER NOT NULL DEFAULT 3
);

CREATE TABLE IF NOT EXISTS vehiculos (
    id SERIAL PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    anio INTEGER NOT NULL,
    placa VARCHAR(20) UNIQUE NOT NULL,
    usuario_id INTEGER REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS servicios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    duracion INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS citas (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    vehiculo_id INTEGER REFERENCES vehiculos(id),
    servicio_id INTEGER REFERENCES servicios(id),
    usuario_id INTEGER REFERENCES usuarios(id),
    notas TEXT,
    estado VARCHAR(20) DEFAULT 'pendiente'
);