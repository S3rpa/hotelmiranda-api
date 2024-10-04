import { Request, Response, NextFunction, Router } from 'express';
import { isLoggedIn } from '../middleware/auth';
import pool from '../../config/db';

const userController = Router();

// Obtener todos los usuarios
userController.get('/', async (_req: Request, res: Response, _next: NextFunction) => {
    try {
        const [users] = await pool.query('SELECT * FROM users');
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching users', error });
    }
});

// Obtener un usuario por ID
userController.get('/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const id = req.params.id;
    try {
        const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [id]) as any[];
        if (user.length > 0) {
            return res.status(200).json(user[0]);
        } else {
            return res.status(404).json({ message: `User with id ${id} not found` });
        }
    } catch (error) {
        return res.status(500).json({ message: `Error fetching user #${id}`, error });
    }
});

// Crear un nuevo usuario
userController.post('/', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const { name, work, schedule, photo, email, telephone, start_date, description, state, password } = req.body;
    try {
        const [result]: any = await pool.query(
            'INSERT INTO users (name, work, schedule, photo, email, telephone, start_date, description, state, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, work, schedule, photo.join(','), email, telephone, start_date, description, state, password]
        );
        const insertedUser = {
            id: result.insertId,
            name,
            work,
            schedule,
            photo,
            email,
            telephone,
            start_date,
            description,
            state,
            password
        };
        return res.status(201).json(insertedUser);
    } catch (error) {
        return res.status(500).json({ message: 'Error adding new user', error });
    }
});

// Eliminar un usuario por ID
userController.delete('/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    try {
        const [result]: any = await pool.query('DELETE FROM users WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `User with id ${id} deleted` });
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
    const { name, work, schedule, photo, email, telephone, start_date, description, state, password } = req.body;
    try {
        const [result]: any = await pool.query(
            'UPDATE users SET name = ?, work = ?, schedule = ?, photo = ?, email = ?, telephone = ?, start_date = ?, description = ?, state = ?, password = ? WHERE id = ?',
            [name, work, schedule, photo.join(','), email, telephone, start_date, description, state, password, id]
        );
        if (result.affectedRows > 0) {
            const [updatedUser] = await pool.query('SELECT * FROM users WHERE id = ?', [id]) as [any[], any];
            return res.status(200).json(updatedUser[0]);
        } else {
            return res.status(404).json({ message: `User with id ${id} not found` });
        }
    } catch (error) {
        return res.status(500).json({ message: `Error updating user #${id}`, error });
    }
});

export { userController };