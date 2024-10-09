import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../../config/db';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'accessSecretKey';
const authController = Router();

// Ruta de autenticación de usuario
authController.post('/', async (req: Request, res: Response, _next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Faltan credenciales' });
  }

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]) as any[];
    const user = users[0];

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const accessToken = jwt.sign({ id: user.id, email: user.email }, ACCESS_TOKEN_SECRET, {
      expiresIn: '1h', 
    });

    return res.json({ 
      accessToken, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      } 
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor', error });
  }
});

export { authController };