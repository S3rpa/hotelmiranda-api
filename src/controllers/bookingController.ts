import { Request, Response, NextFunction, Router } from 'express'
import { isLoggedIn } from '../middleware/auth'
import { BookingModel } from "../schemas/bookingSchema"

const bookingController = Router()

// Obtener todas las reservas
bookingController.get('/', async (_req: Request, res: Response, _next: NextFunction) => {
    try {
        const allbookings = await BookingModel.find()
        return res.status(200).json(allbookings)
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching bookings', error })
    }
})


bookingController.get('/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const id = req.params.id
    try {
        const booking = await BookingModel.findById(id)
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
        const newBooking = new BookingModel({...req.body})
        const insertedBooking = await newBooking.save()
        return res.status(201).json(insertedBooking)
    } catch (error) {
        return res.status(500).json({ message: 'Error adding new booking', error })
    }
})

bookingController.delete('/delete/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params
    try {
        const deletedBooking = await BookingModel.findByIdAndDelete(id)
        return res.status(200).json(deletedBooking)
    } catch (error) {
        return res.status(500).json({ message: `Error deleting booking #${id}`, error })
    }
})

bookingController.put('/update/:id', isLoggedIn, async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params
    try {
        await BookingModel.updateOne({ _id: id }, req.body)        
        const updatedBooking = await BookingModel.findById(id)
        return res.status(200).json(updatedBooking)
    } catch (error) {
        return res.status(500).json({ message: `Error updating booking #${id}`, error })
    }
})

export { bookingController }