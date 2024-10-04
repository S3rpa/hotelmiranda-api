import { Request, Response, NextFunction, Router } from 'express';
import { isLoggedIn } from '../middleware/auth';
import pool from '../../config/db';

const roomController = Router();

// Obtener todas las habitaciones
roomController.get('/', async (_req: Request, res: Response, _next: NextFunction) => {
    try {
        const [rooms] = await pool.query('SELECT * FROM rooms');
        return res.status(200).json(rooms);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching rooms', error });
    }
});

// Obtener una habitación por ID
roomController.get('/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const id = req.params.id;
    try {
        const [room] = await pool.query('SELECT * FROM rooms WHERE id = ?', [id]) as any[];
        if (room.length > 0) {
            return res.status(200).json(room[0]);
        } else {
            return res.status(404).json({ message: `Room with id ${id} not found` });
        }
    } catch (error) {
        return res.status(500).json({ message: `Error fetching room #${id}`, error });
    }
});

// Crear una nueva habitación
roomController.post('/add', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const { room_name, amenities, images, price, offer, status } = req.body;
    try {
        const [result]: any = await pool.query(
            'INSERT INTO rooms (room_name, amenities, images, price, offer, status) VALUES (?, ?, ?, ?, ?, ?)', 
            [room_name, amenities, images.join(','), price, offer, status]
        );
        const insertedRoom = {
            id: result.insertId,
            room_name,
            amenities,
            images,
            price,
            offer,
            status
        };
        return res.status(201).json(insertedRoom);
    } catch (error) {
        return res.status(500).json({ message: 'Error adding new room', error });
    }
});

// Eliminar una habitación por ID
roomController.delete('/delete/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    try {
        const [result]: any = await pool.query('DELETE FROM rooms WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `Room with id ${id} deleted` });
        } else {
            return res.status(404).json({ message: `Room with id ${id} not found` });
        }
    } catch (error) {
        return res.status(500).json({ message: `Error deleting room #${id}`, error });
    }
});

// Actualizar una habitación por ID
roomController.put('/update/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const { room_name, amenities, images, price, offer, status } = req.body;
    try {
        const [result]: any = await pool.query(
            'UPDATE rooms SET room_name = ?, amenities = ?, images = ?, price = ?, offer = ?, status = ? WHERE id = ?',
            [room_name, amenities, images.join(','), price, offer, status, id]
        );
        if (result.affectedRows > 0) {
            const [updatedRoom] = await pool.query('SELECT * FROM rooms WHERE id = ?', [id]) as [any[], any];
            return res.status(200).json(updatedRoom[0]);
        } else {
            return res.status(404).json({ message: `Room with id ${id} not found` });
        }
    } catch (error) {
        return res.status(500).json({ message: `Error updating room #${id}`, error });
    }
});

export { roomController };