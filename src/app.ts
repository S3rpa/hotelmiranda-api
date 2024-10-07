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
import { connectToDatabase } from './db';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Rutas
app.use('/', indexController);
app.use('/api/login', authController);
app.use('/api', dashboardController);
app.use('/api/rooms', isLoggedIn, roomController);
app.use('/api/bookings', isLoggedIn, bookingController);
app.use('/api/contacts', isLoggedIn, contactController);
app.use('/api/users', isLoggedIn, userController);

// Ruta no encontrada
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Manejo de errores
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(`[Error] ${err.stack}`);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Conectar a la base de datos
connectToDatabase().catch(err => {
  console.error('Error al conectar a MongoDB:', err);
});

export default app;