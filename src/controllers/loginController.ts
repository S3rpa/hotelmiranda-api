import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserModel } from '../schemas/userSchema';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'accessSecretKey';  // Se recomienda usar una clave secreta fuerte en producción

const authController = Router();

authController.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  console.log('Recibiendo solicitud de login:', { email, password }); // Log para ver los datos recibidos en el login

  // Verifica que se hayan enviado el correo electrónico y la contraseña
  if (!email || !password) {
    console.log('Faltan credenciales'); // Log para detectar cuando faltan datos
    return res.status(400).json({ message: 'Faltan credenciales' });
  }

  try {
    // Busca al usuario en la base de datos por su correo electrónico
    const user = await UserModel.findOne({ email });
    console.log('Usuario encontrado:', user); // Log para ver si el usuario fue encontrado en la base de datos

    if (!user) {
      console.log('Usuario no encontrado o credenciales inválidas'); // Log cuando el usuario no existe
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Compara la contraseña proporcionada con la almacenada en la base de datos (hasheada)
    const passwordMatches = await bcrypt.compare(password, user.password);
    console.log('¿La contraseña coincide?', passwordMatches); // Log para verificar si las contraseñas coinciden

    if (!passwordMatches) {
      console.log('Contraseña incorrecta'); // Log cuando la contraseña no coincide
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Genera un token JWT con los datos del usuario (id y email)
    const accessToken = jwt.sign({ id: user._id, email: user.email }, ACCESS_TOKEN_SECRET, {
      expiresIn: '1h', // El token expira en 1 hora
    });

    console.log('Token generado:', accessToken); // Log para ver el token generado

    // Devuelve el token y los datos del usuario
    res.json({ 
      accessToken, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name 
      } 
    });
  } catch (error) {
    console.error('Error en el login:', error); // Log para depuración de errores
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export { authController };