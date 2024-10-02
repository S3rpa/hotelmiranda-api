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

    // Conteo de Check-ins y Check-outs
    const today = new Date().toISOString().split('T')[0];

    const checkInsToday = await BookingModel.countDocuments({
      checkIn: { $gte: new Date(today), $lt: new Date(today + 'T23:59:59') },
    });

    const checkOutsToday = await BookingModel.countDocuments({
      checkOut: { $gte: new Date(today), $lt: new Date(today + 'T23:59:59') },
    });

    // Obtener check-ins y check-outs recientes para el gráfico
    const recentBookings = await BookingModel.find({
      $or: [
        { checkIn: { $gte: new Date(today) } },
        { checkOut: { $gte: new Date(today) } },
      ],
    }).select('checkIn checkOut');

    const checkInStats = recentBookings.map(booking => ({
      date: booking.checkIn.toISOString().split('T')[0],
      checkIn: 1,
      checkOut: 0,
    }));

    const checkOutStats = recentBookings.map(booking => ({
      date: booking.checkOut.toISOString().split('T')[0],
      checkIn: 0,
      checkOut: 1,
    }));

    // Datos del dashboard
    const dashboardData = {
      bookingsCount,
      rooms: {
        total: totalRooms,
        bookedPercentage: bookedPercentage.toFixed(2),
      },
      checkInsToday,
      checkOutsToday,
      recentBookings: [...checkInStats, ...checkOutStats],
    };

    return res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

export { dashboardController };