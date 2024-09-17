import { NextFunction, Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../schemas/userSchema";
import { UserInterface } from "../interfaces/userInterface";

const authController = Router();
let userCheck: UserInterface = {
  id: 0,
  email: "",
  password: "",
  name: "",
  work: "",
  schedule: "",
  photo: [],
  telephone: "",
  start_date: "",
  description: "",
  state: "",
};

authController.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const check = await checkUser(email, password);

    if (check) {
      const token = jwt.sign(
        { email, password },
        process.env.TOKEN_SECRET || "secretKey",
        { expiresIn: "1h" }
      );
      userCheck.password = password;
      res.json({ Token: token, User: userCheck });
    } else {
      const error = new Error("Invalid credentials");
      next(error);
    }
  }
)

async function checkUser(email: string, password: string): Promise<boolean> {
  try {
    const user = await UserModel.findOne({ email:email }).exec()
    if (user){
      userCheck = {id: user.id, email: user.email, password: user.password, name: user.name, work: user.work, schedule: user.schedule, photo: user.photo, telephone: user.telephone, start_date: user.start_date, description: user.description, state: user.state}
      return await bcrypt.compare(password, user.password)
    } else {
      return false
    }
  }
  catch(error){
    console.error('Error checking user', error)
    throw new Error('Error checking user')
  }
}

export { authController };
