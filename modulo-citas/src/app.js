import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import citasRoutes from "./routes/citas.routes.js";
import vehiculosRoutes from "./routes/vehiculos.routes.js";
import serviciosRoutes from "./routes/servicios.routes.js";

dotenv.config();

const app = express();

// Configurar CORS para aceptar peticiones de cualquier origen
app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/citas", citasRoutes);
app.use("/api/vehiculos", vehiculosRoutes);
app.use("/api/servicios", serviciosRoutes);

export default app;
