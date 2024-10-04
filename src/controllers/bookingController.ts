import { Request, Response, NextFunction, Router } from 'express';
import { isLoggedIn } from '../middleware/auth';
import pool from '../../config/db';

const bookingController = Router();

// Obtener todas las reservas
bookingController.get('/', async (_req: Request, res: Response, _next: NextFunction) => {
    try {
        const [allbookings] = await pool.query('SELECT * FROM bookings');
        return res.status(200).json(allbookings);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching bookings', error });
    }
});

// Obtener una reserva por ID
bookingController.get('/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const id = req.params.id;
    try {
        const [booking] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]) as any[];
        if (booking.length > 0) {
            return res.status(200).json(booking[0]);
        } else {
            return res.status(404).json({ message: `Booking with id ${id} not found` });
        }
    } catch (error) {
        return res.status(500).json({ message: `Error fetching booking #${id}`, error });
    }
});

// Crear una nueva reserva
bookingController.post('/add', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const { user, room, orderDate, checkIn, checkOut, status, price, specialRequest } = req.body;
    try {
        const [result]: any = await pool.query(
            'INSERT INTO bookings (user, room, orderDate, checkIn, checkOut, status, price, specialRequest) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
            [user, room, orderDate, checkIn, checkOut, status, price, specialRequest]
        );
        const insertedBooking = {
            id: result.insertId,
            user,
            room,
            orderDate,
            checkIn,
            checkOut,
            status,
            price,
            specialRequest
        };
        return res.status(201).json(insertedBooking);
    } catch (error) {
        return res.status(500).json({ message: 'Error adding new booking', error });
    }
});

// Eliminar una reserva por ID
bookingController.delete('/delete/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    try {
        const [result]: any = await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `Booking with id ${id} deleted` });
        } else {
            return res.status(404).json({ message: `Booking with id ${id} not found` });
        }
    } catch (error) {
        return res.status(500).json({ message: `Error deleting booking #${id}`, error });
    }
});

// Actualizar una reserva por ID
bookingController.put('/update/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const { user, room, orderDate, checkIn, checkOut, status, price, specialRequest } = req.body;
    try {
        const [result]: any = await pool.query(
            'UPDATE bookings SET user = ?, room = ?, orderDate = ?, checkIn = ?, checkOut = ?, status = ?, price = ?, specialRequest = ? WHERE id = ?',
            [user, room, orderDate, checkIn, checkOut, status, price, specialRequest, id]
        );
        if (result.affectedRows > 0) {
            const [updatedBooking] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]) as [any[], any];
            return res.status(200).json(updatedBooking[0]);
        } else {
            return res.status(404).json({ message: `Booking with id ${id} not found` });
        }
    } catch (error) {
        return res.status(500).json({ message: `Error updating booking #${id}`, error });
    }
});

export { bookingController };