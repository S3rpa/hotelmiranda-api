import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

const secretKey = process.env.TOKEN_SECRET || 'supersecretkey' 

interface CustomRequest extends Request {
  user?: any
}

export const isLoggedIn = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' })
  }

  try {
    const decoded = jwt.verify(token, secretKey)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' })
  }
}
