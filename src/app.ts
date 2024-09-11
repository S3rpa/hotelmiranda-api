import express, { Application } from 'express';
import cors from 'cors';
import { roomController } from './controllers/roomController';
import { bookingController } from './controllers/bookingController';
import { contactController } from './controllers/contactController';
import { userController } from './controllers/userController';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/rooms', roomController);
app.use('/api/bookings', bookingController);
app.use('/api/contacts', contactController); 
app.use('/api/users', userController);

// Handle invalid routes
app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
