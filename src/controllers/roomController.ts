import { Request, Response, NextFunction, Router } from 'express';
import { isLoggedIn } from '../middleware/auth';
import pool from '../../config/db';
import { roomSchema } from '../validators/roomsValidator';

const roomController = Router();

roomController.get('/', async (_req: Request, res: Response, _next: NextFunction) => {
    try {
        const [rooms] = await pool.query('SELECT * FROM rooms');
        return res.status(200).json(rooms);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching rooms', error });
    }
});

roomController.post('/add', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const { error } = roomSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Validation error', details: error.details });
    }

    const { room_name, amenities, images, price, offer, status } = req.body;
    try {
        const [result]: any = await pool.query(
            'INSERT INTO rooms (room_name, amenities, images, price, offer, status) VALUES (?, ?, ?, ?, ?, ?)', 
            [room_name, amenities, images, price, offer, status]
        );
        return res.status(201).json({ message: 'Room added successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error adding new room', error });
    }
});

roomController.put('/update/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const { error } = roomSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Validation error', details: error.details });
    }

    const { room_name, amenities, images, price, offer, status } = req.body;
    const { id } = req.params;
    try {
        const [result]: any = await pool.query(
            'UPDATE rooms SET room_name = ?, amenities = ?, images = ?, price = ?, offer = ?, status = ? WHERE id = ?', 
            [room_name, amenities, images, price, offer, status, id]
        );
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'Room updated successfully' });
        } else {
            return res.status(404).json({ message: `Room with id ${id} not found` });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error updating room', error });
    }
});

export { roomController };