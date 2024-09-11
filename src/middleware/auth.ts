import { Request, Response, NextFunction } from 'express'

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.headers.authorization

  if (authToken && authToken === 'Bearer valid-token') {
    next() // El usuario está autenticado
  } else {
    res.status(401).json({ message: 'Unauthorized. Please log in.' })
  }
}
