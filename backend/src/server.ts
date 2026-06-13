import 'dotenv/config';
import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import pool from './database/connectionPostgreSQL.ts';
import routes from './routes/index.ts';

const server = express();
const PORT = process.env.PORT || 3000;

// Configurar CORS para permitir credenciales
server.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

server.use(express.json());
server.use(cookieParser());

server.use('/api', routes);

server.get("/", async (req, res) => {
    const result = await pool.query("SELECT current_database()");
    res.send(`nombre de la base de datos: ${result.rows[0].current_database}`);
});

server.listen(PORT, () => {
    console.log(`servidor corriendo en el puerto ${PORT} base de datos postgres`);
});
