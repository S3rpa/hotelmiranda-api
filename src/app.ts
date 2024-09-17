import express, { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import cors from 'cors'
import { roomController } from './controllers/roomController'
import { bookingController } from './controllers/bookingController'
import { contactController } from './controllers/contactController'
import { userController } from './controllers/userController'
import { isLoggedIn } from './middleware/auth'
import { indexController } from './controllers/indexController'
import { authController } from './controllers/loginController'

const mongoose = require("mongoose");

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const secretKey = process.env.TOKEN_SECRET || 'supersecretkey'

app.use(cors())
app.use(express.json())

app.use('/', indexController);
app.use('/api/login', authController)
app.use('/api/rooms', isLoggedIn, roomController)
app.use('/api/bookings', isLoggedIn, bookingController)
app.use('/api/contacts', isLoggedIn, contactController)
app.use('/api/users', isLoggedIn, userController)

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Start server
const start = async () => {
  try {
    await mongoose.connect(
      "mongodb://root:root@localhost:27017/mongoose?authSource=admin"
    );
    app.listen(3000, () => console.log("Server started on port 3000"));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();

export default app
