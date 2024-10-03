import { Request, Response, NextFunction, Router } from 'express';
import { isLoggedIn } from '../middleware/auth';
import { UserModel } from '../schemas/userSchema';
import multer from 'multer';

const userController = Router();
const upload = multer({ dest: 'uploads/' });

// Obtener todos los usuarios
userController.get('/', async (_req: Request, res: Response, _next: NextFunction) => {
    try {
        const users = await UserModel.find();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching users', error });
    }
});

// Obtener un usuario por ID
userController.get('/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    try {
        const user = await UserModel.findById(id);
        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(404).json({ message: `User with id ${id} not found` });
        }
    } catch (error) {
        return res.status(500).json({ message: `Error fetching user #${id}`, error });
    }
});

// Crear un nuevo usuario
userController.post('/', isLoggedIn, upload.single('photo'), async (req, res) => {
    try {
      const { name, work, schedule, telephone, email, description, password, start_date, state } = req.body;
      const newUser = new UserModel({
        name,
        work,
        schedule,
        telephone,
        email,
        description,
        password,
        start_date,
        state,
        photo: req.file ? `/uploads/${req.file.filename}` : null,
      });
      const insertedUser = await newUser.save();
      return res.status(201).json(insertedUser);
    } catch (error) {
      return res.status(500).json({ message: 'Error adding new user', error });
    }
  });

// Eliminar un usuario por ID
userController.delete('/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    try {
        const deletedUser = await UserModel.findByIdAndDelete(id);
        if (deletedUser) {
            return res.status(200).json(deletedUser);
        } else {
            return res.status(404).json({ message: `User with id ${id} not found` });
        }
    } catch (error) {
        return res.status(500).json({ message: `Error deleting user #${id}`, error });
    }
});

// Actualizar un usuario por ID
userController.put('/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
        if (updatedUser) {
            return res.status(200).json(updatedUser);
        } else {
            return res.status(404).json({ message: `User with id ${id} not found` });
        }
    } catch (error) {
        return res.status(500).json({ message: `Error updating user #${id}`, error });
    }
});

export { userController };