import pool from '../config/db';
import { faker } from '@faker-js/faker';
<<<<<<< HEAD
import bcrypt from 'bcryptjs';
import { UserModel } from './schemas/userSchema';
import { RoomModel } from './schemas/roomSchema';
import { BookingModel } from './schemas/bookingSchema';
import { ContactModel } from './schemas/contactSchema';
import { UserInterface } from './interfaces/userInterface';
import { Room } from './interfaces/roomsInterface';
import { Booking } from './interfaces/bookingsInterface';
import { Contact } from './interfaces/contactInterface';
=======
>>>>>>> 8411f7a23a6af74056526a9c22c4ac4166aa3e5e

async function seedDatabase() {
    try {
        // Crear la tabla 'users'
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                work VARCHAR(255) NOT NULL,
                schedule VARCHAR(255) NOT NULL,
                photo TEXT NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                telephone VARCHAR(50) NOT NULL,
                start_date DATE NOT NULL,
                description TEXT NOT NULL,
                state VARCHAR(100),
                password VARCHAR(255) NOT NULL
            )
        `);

<<<<<<< HEAD
// Semilla para faker
faker.seed(1234);
=======
        // Crear la tabla 'rooms'
        await pool.query(`
            CREATE TABLE IF NOT EXISTS rooms (
                id INT AUTO_INCREMENT PRIMARY KEY,
                room_name VARCHAR(255) NOT NULL,
                amenities TEXT NOT NULL,
                images TEXT NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                offer DECIMAL(5,2) NOT NULL DEFAULT 0,
                status ENUM('Available', 'Booked', 'Under Maintenance') NOT NULL
            )
        `);

        // Crear la tabla 'bookings'
        await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                room_id INT NOT NULL,
                orderDate DATETIME NOT NULL,
                checkIn DATETIME NOT NULL,
                checkOut DATETIME NOT NULL,
                status ENUM('Booked', 'Pending', 'Cancelled', 'Refund') NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                specialRequest TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
            )
        `);
>>>>>>> 8411f7a23a6af74056526a9c22c4ac4166aa3e5e

        // Crear la tabla 'contacts'
        await pool.query(`
            CREATE TABLE IF NOT EXISTS contacts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                contact_id VARCHAR(255) NOT NULL,
                date DATETIME NOT NULL,
                customer VARCHAR(255) NOT NULL,
                comment TEXT NOT NULL,
                gender VARCHAR(10) NOT NULL,
                ip_address VARCHAR(100) NOT NULL,
                status ENUM('Pending', 'Resolved', 'Closed') NOT NULL
            )
        `);

        // Limpiar tablas
        await pool.query('DELETE FROM bookings');
        await pool.query('DELETE FROM rooms');
        await pool.query('DELETE FROM users');
        await pool.query('DELETE FROM contacts');

<<<<<<< HEAD
// Función para crear usuarios aleatorios
const createRandomUser = (): Partial<UserInterface> => ({
  _id: new mongoose.Types.ObjectId(),
  name: faker.person.fullName(),
  work: faker.person.jobTitle(),
  schedule: faker.date.recent().toISOString(),
  photo: [faker.image.avatar()],
  email: faker.internet.email(),
  telephone: faker.phone.number(),
  start_date: faker.date.recent().toISOString(),
  description: faker.lorem.sentence(),
  state: 'ACTIVE',
  password: faker.internet.password(),
});

// Función para crear habitaciones aleatorias
const createRandomRoom = (): Partial<Room> => ({
  id: faker.string.uuid(),
  room_name: faker.lorem.word(),
  amenities: faker.lorem.sentence(),
  images: [faker.image.url()],
  price: faker.number.int({ min: 100, max: 500 }),
  offer: faker.number.int({ min: 50, max: 200 }),
  status: faker.helpers.arrayElement(['Available', 'Booked', 'Under Maintenance']),
});

// Función para crear reservas aleatorias
const createRandomBooking = (user: UserInterface, room: Room): Partial<Booking> => {
  return {
    user: { 
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
    room: room._id,
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
const createRandomContact = (): Partial<Contact> => ({
  Contact_id: faker.string.uuid(),
  Date: faker.date.recent(),
  Customer: faker.person.fullName(),
  Comment: faker.lorem.sentence(),
  gender: faker.person.sex(),
  ip_address: faker.internet.ip(),
  status: faker.helpers.arrayElement(['Active', 'Inactive']),
});

// Función para crear el usuario administrador
const createAdminUser = async (): Promise<UserInterface | null> => {
  try {
    console.log('Iniciando la creación del usuario admin...');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

    // Verificar si el admin ya existe
    const existingAdmin = await UserModel.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('El usuario admin ya existe en la base de datos.');
      return existingAdmin;
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    console.log('Contraseña del admin hasheada correctamente.');

    // Crear objeto del usuario admin
    const adminUser: Partial<UserInterface> = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Admin User',
      work: 'Administrator',
      schedule: new Date().toISOString(),
      photo: [faker.image.avatar()],
      email: adminEmail,
      telephone: faker.phone.number(),
      start_date: new Date().toISOString(),
      description: 'System Administrator',
      state: 'ACTIVE',
      password: hashedPassword,
    };

    console.log('Datos del usuario admin preparados:', adminUser);

    // Guardar el usuario admin en la base de datos
    const savedUser = await new UserModel(adminUser).save();
    console.log('Usuario admin guardado exitosamente:', savedUser);
    return savedUser;
  } catch (error: any) {
    console.error('Error al crear el usuario admin:', error.message);
    return null;
  }
};

const startDatabase = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Conectado a MongoDB');

    // Limpiar las colecciones
    await UserModel.deleteMany({});
    await RoomModel.deleteMany({});
    await BookingModel.deleteMany({});
    await ContactModel.deleteMany({});
    console.log('Colecciones limpiadas');

    // Crear el usuario admin
    const admin = await createAdminUser();
    if (admin) {
      users.push(admin);
      console.log(`Usuario admin creado: ${admin.name} con email: ${admin.email}`);
    }

    // Crear usuarios, habitaciones, reservas
    for (let i = 0; i < 20; i++) {
      const userData = createRandomUser();
      const user = await new UserModel(userData).save();

      users.push(user);
      const roomData = createRandomRoom();
      const room = await new RoomModel(roomData).save();
      
      const contactData = createRandomContact();
      await new ContactModel(contactData).save();
      console.log(`Contacto creado para ${contactData.Customer}`);

      const bookingData = createRandomBooking(user, room);
      await new BookingModel(bookingData).save();
      console.log(`Reserva creada para ${user.name}`);
    }
  } catch (error) {
    console.error('Error durante la inicialización:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }
};

startDatabase();
=======
        // Insertar datos en la tabla 'users'
        const userIds: number[] = [];
        for (let i = 0; i < 10; i++) {
            const [result]: any = await pool.query('INSERT INTO users (name, work, schedule, photo, email, telephone, start_date, description, state, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                faker.name.findName(),
                faker.name.jobTitle(),
                faker.lorem.words(3),
                faker.image.avatar(),
                faker.internet.email(),
                faker.phone.phoneNumber(),
                faker.date.past().toISOString().split('T')[0],
                faker.lorem.paragraph(),
                faker.address.stateAbbr(),
                faker.internet.password()
            ]);
            userIds.push(result.insertId);
        }

        // Insertar datos en la tabla 'rooms'
        const roomIds: number[] = [];
        for (let i = 0; i < 10; i++) {
            const [result]: any = await pool.query('INSERT INTO rooms (room_name, amenities, images, price, offer, status) VALUES (?, ?, ?, ?, ?, ?)', [
                faker.company.companyName(),
                faker.commerce.product(),
                faker.image.imageUrl(),
                faker.commerce.price(100, 1000, 2),
                faker.commerce.price(10, 50, 2),
                faker.helpers.arrayElement(['Available', 'Booked', 'Under Maintenance'])
            ]);
            roomIds.push(result.insertId);
        }

        // Insertar datos en la tabla 'bookings'
        for (let i = 0; i < 10; i++) {
            const userId = userIds[Math.floor(Math.random() * userIds.length)];
            const roomId = roomIds[Math.floor(Math.random() * roomIds.length)];

            await pool.query('INSERT INTO bookings (user_id, room_id, orderDate, checkIn, checkOut, status, price, specialRequest) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
                userId,
                roomId,
                faker.date.past().toISOString().split('T')[0],
                faker.date.future().toISOString().split('T')[0],
                faker.date.future().toISOString().split('T')[0],
                'Pending',
                faker.datatype.number({ min: 100, max: 1000 }),
                faker.lorem.sentence()
            ]);
        }

        // Insertar datos en la tabla 'contacts'
        for (let i = 0; i < 10; i++) {
            await pool.query('INSERT INTO contacts (contact_id, date, customer, comment, gender, ip_address, status) VALUES (?, ?, ?, ?, ?, ?, ?)', [
                faker.datatype.uuid(),
                faker.date.past().toISOString().split('T')[0],
                faker.name.findName(),
                faker.lorem.paragraph(),
                faker.name.gender(true),
                faker.internet.ip(),
                faker.helpers.arrayElement(['Pending', 'Resolved', 'Closed'])
            ]);
        }

        console.log('Datos de ejemplo insertados correctamente');
    } catch (error) {
        console.error('Error al poblar la base de datos:', error);
    } finally {
        pool.end();
    }
}

seedDatabase();
>>>>>>> 8411f7a23a6af74056526a9c22c4ac4166aa3e5e
