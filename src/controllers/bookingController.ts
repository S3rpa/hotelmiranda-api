import { BookingService } from "../services/bookingService"
import { Request, Response, NextFunction, Router } from 'express'
import { isLoggedIn } from '../middleware/auth'

export const bookingController = Router()

// Obtener todas las reservas
bookingController.get('/', async (_req: Request, res: Response, _next: NextFunction) => {
    try {
        const bookings = await BookingService.fetchAll()
        return res.status(200).json(bookings)
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching bookings', error })
    }
})


bookingController.get('/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const id = req.params.id
    try {
        const booking = await BookingService.fetchOne(id)
        if (booking) {
            return res.status(200).json(booking)
        } else {
            return res.status(404).json({ message: `Booking with id ${id} not found` })
        }
    } catch (error) {
        return res.status(500).json({ message: `Error fetching booking #${id}`, error })
    }
})

bookingController.post('/add', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    try {
        const bookingData = req.body
        const newBooking = await BookingService.add(bookingData)
        return res.status(201).json(newBooking)
    } catch (error) {
        return res.status(500).json({ message: 'Error adding new booking', error })
    }
})

bookingController.delete('/delete/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const id = req.params.id
    try {
        const deletedBooking = await BookingService.delete(id)
        if (deletedBooking) {
            return res.status(200).json(deletedBooking)
        } else {
            return res.status(404).json({ message: `Booking with id ${id} not found` })
        }
    } catch (error) {
        return res.status(500).json({ message: `Error deleting booking #${id}`, error })
    }
})

bookingController.put('/update/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const id = req.params.id
    const bookingData = req.body
    try {
        const updatedBooking = await BookingService.update(id, bookingData)
        if (updatedBooking) {
            return res.status(200).json(updatedBooking)
        } else {
            return res.status(404).json({ message: `Booking with id ${id} not found` })
        }
    } catch (error) {
        return res.status(500).json({ message: `Error updating booking #${id}`, error })
    }
})
