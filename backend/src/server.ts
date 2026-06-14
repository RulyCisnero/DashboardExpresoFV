import 'dotenv/config';
import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import pool from './database/connectionPostgreSQL.js';
import routes from './routes/index.js';

const server = express();
const PORT = process.env.PORT || 3000;
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("NODE_ENV:", process.env.NODE_ENV);
// Configurar CORS para permitir credenciales
/* server.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://expresofv.netlify.app'
  ],
  credentials: true,
})); */
server.use(cors({
  origin: true,
  credentials: true,
}));

server.options('*', cors({
  origin: true,
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
