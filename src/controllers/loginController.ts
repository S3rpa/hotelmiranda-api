import { NextFunction, Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserModel } from "../schemas/userSchema";
import { UserInterface } from "../interfaces/userInterface";

const authController = Router();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "accessSecretKey";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refreshSecretKey";

// Almacenar los refresh tokens temporalmente (en producción se debe usar una base de datos)
let refreshTokens: string[] = [];

let userCheck: UserInterface = {
  id: "",
  email: "",
  password: "",
  name: "",
  work: "",
  schedule: "",
  photo: [],
  telephone: "",
  start_date: "",
  description: "",
  state: "ACTIVE",
};

authController.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
      const user = await checkUser(email, password);

      if (user) {
        const accessToken = jwt.sign(
          { id: user.id, email: user.email, name: user.name },
          ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
          { id: user.id, email: user.email, name: user.name },
          REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" }
        );

        refreshTokens.push(refreshToken);

        // No enviar la contraseña en la respuesta
        const { password, ...userWithoutPassword } = user;

        // Respuesta con Access Token, Refresh Token y datos del usuario
        res.json({ accessToken, refreshToken, user: userWithoutPassword });
      } else {
        res.status(401).json({ message: "Credenciales inválidas" });
      }
    } catch (error) {
      next(error);
    }
  }
);

authController.post("/refresh-token", (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Token de refresco requerido" });
  }

  if (!refreshTokens.includes(token)) {
    return res.status(403).json({ message: "Token de refresco inválido" });
  }

  // Verificar el Refresh Token
  jwt.verify(token, REFRESH_TOKEN_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: "Token de refresco inválido o expirado" });
    }

    // Generar un nuevo Access Token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ accessToken });
  });
});

async function checkUser(email: string, password: string): Promise<UserInterface | null> {
  try {
    const user = await UserModel.findOne({ email }).exec();
    if (user) {
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (passwordMatches) {
        return {
          id: user.id,
          email: user.email,
          password: user.password,
          name: user.name,
          work: user.work,
          schedule: user.schedule,
          photo: user.photo,
          telephone: user.telephone,
          start_date: user.start_date,
          description: user.description,
          state: user.state,
        };
      }
    }
    return null;
  } catch (error) {
    console.error("Error al verificar el usuario:", error);
    throw new Error("Error checking user");
  }
}

export { authController };