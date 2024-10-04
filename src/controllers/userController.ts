import { Request, Response, NextFunction, Router } from 'express';
import { isLoggedIn } from '../middleware/auth';
import pool from '../../config/db';
import { userSchema } from '../validators/userValidator';

const userController = Router();

userController.get('/', async (_req: Request, res: Response, _next: NextFunction) => {
    try {
        const [users] = await pool.query('SELECT * FROM users');
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching users', error });
    }
});

userController.post('/add', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Validation error', details: error.details });
    }

    const { name, work, schedule, photo, email, telephone, start_date, description, state, password } = req.body;
    try {
        const [result]: any = await pool.query(
            'INSERT INTO users (name, work, schedule, photo, email, telephone, start_date, description, state, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [name, work, schedule, photo, email, telephone, start_date, description, state, password]
        );
        return res.status(201).json({ message: 'User added successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error adding new user', error });
    }
});

userController.put('/update/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Validation error', details: error.details });
    }

    const { name, work, schedule, photo, email, telephone, start_date, description, state, password } = req.body;
    const { id } = req.params;
    try {
        const [result]: any = await pool.query(
            'UPDATE users SET name = ?, work = ?, schedule = ?, photo = ?, email = ?, telephone = ?, start_date = ?, description = ?, state = ?, password = ? WHERE id = ?', 
            [name, work, schedule, photo, email, telephone, start_date, description, state, password, id]
        );
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'User updated successfully' });
        } else {
            return res.status(404).json({ message: `User with id ${id} not found` });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error updating user', error });
    }
});

export { userController };