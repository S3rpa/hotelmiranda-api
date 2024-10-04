import { Router, Request, Response } from 'express';
import { isLoggedIn } from '../middleware/auth';
import pool from '../../config/db';

const dashboardController = Router();

dashboardController.get('/dashboard', isLoggedIn, async (_req: Request, res: Response) => {
  try {
    // 1. Conteo total de reservas (bookingsCount)
    const [rows]: any = await pool.query('SELECT COUNT(*) AS bookingsCount FROM bookings');
    const bookingsCount = rows[0].bookingsCount;

    // 2. Porcentaje de habitaciones con estado 'Booked'
    const [totalRoomsResult] = await pool.query('SELECT COUNT(*) AS totalRooms FROM rooms');
    const totalRooms = (totalRoomsResult as any)[0].totalRooms;
    const [bookedRoomsResult]: any = await pool.query("SELECT COUNT(*) AS bookedRooms FROM rooms WHERE status = 'Booked'");
    const bookedRooms = bookedRoomsResult[0].bookedRooms;
    const bookedPercentage = totalRooms > 0 ? (bookedRooms / totalRooms) * 100 : 0;

    // 3. Conteo de Check-ins y Check-outs
    const today = new Date().toISOString().split('T')[0];

    const [checkInsResult]: any = await pool.query(
      `SELECT COUNT(*) AS checkInsToday FROM bookings WHERE checkIn BETWEEN ? AND ?`, 
      [`${today} 00:00:00`, `${today} 23:59:59`]
    );
    const checkInsToday = checkInsResult[0].checkInsToday;

    const [checkOutsResult]: any = await pool.query(
      `SELECT COUNT(*) AS checkOutsToday FROM bookings WHERE checkOut BETWEEN ? AND ?`, 
      [`${today} 00:00:00`, `${today} 23:59:59`]
    );
    const checkOutsToday = checkOutsResult[0].checkOutsToday;

    // 4. Obtener check-ins y check-outs recientes para el gráfico
    const [recentBookings] = await pool.query(
      `SELECT checkIn, checkOut FROM bookings WHERE checkIn >= ? OR checkOut >= ?`, 
      [today, today]
    );

    // Mapear los datos de check-ins y check-outs recientes para los gráficos
    const checkInStats = (recentBookings as any[]).map((booking: any) => ({
      date: new Date(booking.checkIn).toISOString().split('T')[0],
      checkIn: 1,
      checkOut: 0,
    }));

    const checkOutStats = (recentBookings as any[]).map((booking: any) => ({
      date: new Date(booking.checkOut).toISOString().split('T')[0],
      checkIn: 0,
      checkOut: 1,
    }));

    // Preparar datos del dashboard
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