import { Request, Response, Router } from 'express'
import jwt from 'jsonwebtoken'

const secretKey = 'supersecretkey'

const hardcodedUser = {
  email: 'admin',
  password: 'admin'
};

export const authController = Router();

authController.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body

  if (email === hardcodedUser.email && password === hardcodedUser.password) {

    const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' })

    return res.status(200).json({ message: 'Login successful', token })
  }

  return res.status(401).json({ message: 'Invalid email or password' })
})
