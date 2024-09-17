import { Request, Response, Router } from 'express'
import jwt from 'jsonwebtoken'

const secretKey = 'supersecretkey'

const hardcodedUser = {
  username: 'admin',
  password: 'admin'
};

export function authenticateUser(username: string, password: string) {
  if (username === 'admin' && password === 'admin') {
    return { id: 1, username: 'admin' }
  }
  return null
}

export function generateAccessToken(user: object): string {
  return jwt.sign(user, secretKey, { expiresIn: '1800s' })
}
const authController = Router();

authController.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body

  if (username === hardcodedUser.username && password === hardcodedUser.password) {

    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' })

    return res.status(200).json({ message: 'Login successful', token })
  }

  return res.status(401).json({ message: 'Invalid username or password' })
})

export { authController };