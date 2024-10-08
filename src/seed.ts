import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import { UserModel } from './schemas/userSchema';
import { RoomModel } from './schemas/roomSchema';
import { BookingModel } from './schemas/bookingSchema';
import { ContactModel } from './schemas/contactSchema';
import { UserInterface } from './interfaces/userInterface';
import { Room } from './interfaces/roomsInterface';
import { Booking } from './interfaces/bookingsInterface';
import { Contact } from './interfaces/contactInterface';

// Configurar variables de entorno
dotenv.config();

// Semilla para faker
faker.seed(1234);

// URI de MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/Miranda';

// Arreglos para almacenar datos creados
let users: UserInterface[] = [];
let rooms: Room[] = [];

// Función para crear usuarios aleatorios
const createRandomUser = (): UserInterface => ({
  _id: new mongoose.Types.ObjectId(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  telephone: faker.phone.number(),
  password: bcrypt.hashSync(faker.internet.password(), 10),
  work: faker.person.jobTitle(),
  schedule: faker.date.recent().toISOString(),
  photo: [faker.image.avatar()],
  start_date: faker.date.recent().toISOString(),
  description: faker.lorem.sentence(),
  state: 'ACTIVE',
});

// Función para crear habitaciones aleatorias
const createRandomRoom = (): Room => ({
  id: faker.string.uuid(),
  room_name: faker.lorem.word(),
  amenities: faker.lorem.sentence(),
  images: [faker.image.url()],
  price: faker.number.int({ min: 100, max: 500 }),
  offer: faker.number.int({ min: 50, max: 200 }),
  status: faker.helpers.arrayElement(['Available', 'Booked', 'Under Maintenance']),
});

// Función para crear reservas aleatorias
const createRandomBooking = (user: UserInterface, room: Room): Booking => {
  return {
    user: { 
      id: user._id.toString(), 
      name: user.name,
      email: user.email,
    },
    room: room._id!,
    _id: faker.string.uuid(),
    orderDate: faker.date.recent(),
    checkIn: faker.date.future(),
    checkOut: faker.date.future(),
    status: faker.helpers.arrayElement(['Booked', 'Pending', 'Cancelled', 'Refund']),
    price: faker.number.int({ min: 200, max: 500 }),
    specialRequest: faker.lorem.sentence(),
  };
};

// Función para crear contactos aleatorios
const createRandomContact = (): Contact => ({
  Contact_id: faker.string.uuid(),
  Date: faker.date.recent(),
  Customer: faker.person.fullName(),
  Comment: faker.lorem.sentence(),
  gender: faker.person.sex(),
  ip_address: faker.internet.ip(),
  status: faker.helpers.arrayElement(['Pending', 'Resolved', 'Closed']),
});

// Función para crear el usuario administrador
const createAdminUser = async (): Promise<UserInterface | null> => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

    // Verificar si el admin ya existe
    const existingAdmin = await UserModel.findOne({ email: adminEmail });
    if (existingAdmin) {
      return existingAdmin;
    }

    const adminUser: UserInterface = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Admin User',
      email: adminEmail,
      telephone: faker.phone.number(),
      password: bcrypt.hashSync(adminPassword, 10),
      work: 'Administrator',
      schedule: new Date().toISOString(),
      photo: [faker.image.avatar()],
      start_date: new Date().toISOString(),
      description: 'System Administrator',
      state: 'ACTIVE',
    };

    return await new UserModel(adminUser).save();
  } catch (error: any) {
    console.error('Error al crear el usuario admin:', error.message);
    return null;
  }
};

// Función principal para inicializar la base de datos
const startDatabase = async () => {
  try {
    await mongoose.connect(mongoURI);

    // Limpiar las colecciones
    await UserModel.deleteMany({});
    await RoomModel.deleteMany({});
    await BookingModel.deleteMany({});
    await ContactModel.deleteMany({});

    // Crear el usuario admin
    const admin = await createAdminUser();
    if (admin) {
      users.push(admin);
    }

    // Crear usuarios, habitaciones, reservas y contactos
    for (let i = 0; i < 20; i++) {
      const userData = createRandomUser();
      const user = await new UserModel(userData).save();
      users.push(user);
      
      const roomData = createRandomRoom();
      const room = await new RoomModel(roomData).save();
      
      const contactData = createRandomContact();
      await new ContactModel(contactData).save();

      const bookingData = createRandomBooking(user, room);
      await new BookingModel(bookingData).save();
    }
  } catch (error) {
    console.error('Error durante la inicialización:', error);
  } finally {
    await mongoose.disconnect();
  }
};

startDatabase();