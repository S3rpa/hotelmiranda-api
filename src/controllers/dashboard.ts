import { Router, Request, Response } from 'express';
import { isLoggedIn } from '../middleware/auth';
import { BookingModel } from '../schemas/bookingSchema';  // Modelo de Bookings
import { RoomModel } from '../schemas/roomSchema';  // Modelo de Rooms

const dashboardController = Router();

dashboardController.get('/dashboard', isLoggedIn, async (req: Request, res: Response) => {
  try {
    // 1. Conteo total de reservas (bookingsCount)
    const bookingsCount = await BookingModel.countDocuments();

    // 2. Porcentaje de habitaciones con estado 'Booked'
    const totalRooms = await RoomModel.countDocuments();
    const bookedRooms = await RoomModel.countDocuments({ status: 'Booked' });
    const bookedPercentage = totalRooms > 0 ? (bookedRooms / totalRooms) * 100 : 0;

    // 3. Conteo de Check-ins y Check-outs
    const today = new Date().toISOString().split('T')[0];

    const checkInsToday = await BookingModel.countDocuments({
      checkIn: { $gte: new Date(today), $lt: new Date(today + 'T23:59:59') },
    });

    const checkOutsToday = await BookingModel.countDocuments({
      checkOut: { $gte: new Date(today), $lt: new Date(today + 'T23:59:59') },
    });

    // Datos del dashboard
    const dashboardData = {
      bookingsCount,
      rooms: {
        total: totalRooms,
        booked: bookedRooms,
        bookedPercentage: bookedPercentage.toFixed(2),
      },
      checkInsToday,
      checkOutsToday,
    };

    return res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

export { dashboardController };