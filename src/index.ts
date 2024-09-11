import express from 'express'
import { usersController } from './controllers/userController'

const app = express()
app.use(express.json())

app.use('/users', usersController)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
