import { Router, Request, Response } from 'express';
import { isLoggedIn } from '../middleware/auth';
import { BookingModel } from '../schemas/bookingSchema';
import { RoomModel } from '../schemas/roomSchema';

const dashboardController = Router();

dashboardController.get('/dashboard', isLoggedIn, async (req: Request, res: Response) => {
  try {
    // Conteo total de reservas (bookingsCount)
    const bookingsCount = await BookingModel.countDocuments();

    // Porcentaje de habitaciones con estado 'Booked'
    const totalRooms = await RoomModel.countDocuments();
    const bookedRooms = await RoomModel.countDocuments({ status: 'Booked' });
    const bookedPercentage = totalRooms > 0 ? (bookedRooms / totalRooms) * 100 : 0;

    // Obtener el inicio y el final del día actual
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); 
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Conteo de Check-ins y Check-outs para el día actual
    const checkInsToday = await BookingModel.countDocuments({
      checkIn: { $gte: startOfDay, $lte: endOfDay },
    });

    const checkOutsToday = await BookingModel.countDocuments({
      checkOut: { $gte: startOfDay, $lte: endOfDay },
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