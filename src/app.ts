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
import { authenticateUser, generateAccessToken } from './controllers/loginController'

const mongoose = require("mongoose");

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const secretKey = process.env.TOKEN_SECRET || 'supersecretkey'

app.use(cors())
app.use(express.json())

  app.post('/api/login', (req: Request, res: Response) => {
    const { username, password } = req.body
  
    const user = authenticateUser(username, password)
  
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
  
    const token = generateAccessToken({ username: user.username, id: user.id })
    return res.json({ token })
  })

app.use('/', indexController);
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
