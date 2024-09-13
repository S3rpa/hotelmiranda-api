import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import cors from 'cors'
import { roomController } from './controllers/roomController'
import { bookingController } from './controllers/bookingController'
import { contactController } from './controllers/contactController'
import { userController } from './controllers/userController'
import { isLoggedIn } from './middleware/auth'
import { indexController } from './controllers/indexController'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const secretKey = process.env.TOKEN_SECRET || 'supersecretkey'

app.use(cors())
app.use(express.json())

function authenticateUser(username: string, password: string) {
    if (username === 'admin' && password === 'admin') {
      return { id: 1, username: 'admin' }
    }
    return null
  }
  
  function generateAccessToken(user: object): string {
    return jwt.sign(user, secretKey, { expiresIn: '1800s' })
  }

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

// Basic API root check
app.get('/', (_req: Request, res: Response) => {
  res.send('API is working')
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

export default app
