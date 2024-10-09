import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserModel } from '../schemas/userSchema';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'accessSecretKey';
const authController = Router();

authController.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  console.log('Recibiendo solicitud de login:', { email, password });

  if (!email || !password) {
    console.log('Faltan credenciales');
    return res.status(400).json({ message: 'Faltan credenciales' });
  }

  try {
    const user = await UserModel.findOne({ email });
    console.log('Usuario encontrado:', user);
    if (!user) {
      console.log('Usuario no encontrado o credenciales inválidas');
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    console.log('¿La contraseña coincide?', passwordMatches); 
    if (!passwordMatches) {
      console.log('Contraseña incorrecta'); 
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const accessToken = jwt.sign({ id: user._id, email: user.email }, ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',
    });

    console.log('Token generado:', accessToken);
    res.json({ 
      accessToken, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name 
      } 
    });
  } catch (error) {
    console.error('Error en el login:', error);
    return res.status(500).json({ 
      message: 'Error interno del servidor',
      error: (error as Error).message,
    });
  }
});

export { authController };