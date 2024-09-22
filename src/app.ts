import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import mongoose from 'mongoose';

import { roomController } from './controllers/roomController';
import { bookingController } from './controllers/bookingController';
import { contactController } from './controllers/contactController';
import { userController } from './controllers/userController';
import { isLoggedIn } from './middleware/auth';
import { indexController } from './controllers/indexController';
import { authController } from './controllers/loginController';

const app = express();
const PORT = process.env.PORT || 3001;
const secretKey = process.env.TOKEN_SECRET || 'supersecretkey';
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://sergiobarbera1:9mFnNMoBDAzEgSTf@miranda.p0ar9.mongodb.net/Miranda';

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/', indexController);
app.use('/api/login', authController);
app.use('/api/rooms', isLoggedIn, roomController);
app.use('/api/bookings', isLoggedIn, bookingController);
app.use('/api/contacts', isLoggedIn, contactController);
app.use('/api/users', isLoggedIn, userController);

// Ruta no encontrada
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Iniciar servidor
const startServer = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.error('Error connecting to MongoDB:', (error as Error).message);
    process.exit(1);
  }
};

// Cerrar conexión a MongoDB al finalizar
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Disconnected from MongoDB due to app termination');
  process.exit(0);
});

startServer();

export default app;