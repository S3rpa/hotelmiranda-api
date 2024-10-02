import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserModel } from '../schemas/userSchema';

const authController = Router();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'accessSecretKey';


authController.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Verifica que el cuerpo de la solicitud tenga los campos necesarios
  if (!email || !password) {
    return res.status(400).json({ message: 'Faltan credenciales' });
  }

  try {
    // Busca al usuario en la base de datos
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Compara la contraseña hasheada
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Genera el token de acceso
    const accessToken = jwt.sign({ id: user._id, email: user.email }, ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',
    });

    // Retorna el token y los datos del usuario
    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
});

export { authController };