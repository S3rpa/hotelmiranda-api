import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { roomController } from './controllers/roomController';
import { bookingController } from './controllers/bookingController';
import { contactController } from './controllers/contactController';
import { userController } from './controllers/userController';
import { isLoggedIn } from './middleware/auth';
import { indexController } from './controllers/indexController';
import { authController } from './controllers/loginController';
import { dashboardController } from './controllers/dashboard';
import pool from '../config/db';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET);

// Log de solicitudes
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

async function checkDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conectado a MySQL');
    connection.release();
  } catch (err) {
    console.error('Error al conectar con MySQL:', err);
  }
}

checkDatabaseConnection();

// Rutas
app.use('/', indexController);
app.use('/api/login', authController);
app.use('/api', isLoggedIn, dashboardController);
app.use('/api/rooms', isLoggedIn, roomController);
app.use('/api/bookings', isLoggedIn, bookingController);
app.use('/api/contacts', isLoggedIn, contactController);
app.use('/api/users', isLoggedIn, userController);

// Ruta no encontrada
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Manejo de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[Error] ${err.stack}`);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Exporta el manejador para AWS Lambda
export default app;