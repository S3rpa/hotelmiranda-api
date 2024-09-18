import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import { roomController } from './controllers/roomController'
import { bookingController } from './controllers/bookingController'
import { contactController } from './controllers/contactController'
import { userController } from './controllers/userController'
import { isLoggedIn } from './middleware/auth'
import { indexController } from './controllers/indexController'
import { authController } from './controllers/loginController'
import mongoose from 'mongoose'

const app = express()
const PORT = process.env.PORT || 3000
const secretKey = process.env.TOKEN_SECRET || 'supersecretkey'

app.use(cors())
app.use(express.json())

app.use('/', indexController)
app.use('/api/login', authController)
app.use('/api/rooms', isLoggedIn, roomController)
app.use('/api/bookings', isLoggedIn, bookingController)
app.use('/api/contacts', isLoggedIn, contactController)
app.use('/api/users', isLoggedIn, userController)

// Ruta no encontrada
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' })
})

// Iniciar servidor
const startServer = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017'
    )
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

startServer()

export default app