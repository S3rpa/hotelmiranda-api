import mongoose from 'mongoose';
import { BookingModel } from './schemas/bookingSchema';
import { ContactModel } from './schemas/contactSchema';
import { RoomModel } from './schemas/roomSchema';
import { UserModel } from './schemas/userSchema';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

dotenv.config();
faker.seed(1234);

const mongoURI = process.env.MONGO_URI || 'mongodb+srv://sergiobarbera1:9mFnNMoBDAzEgSTf@miranda.p0ar9.mongodb.net/Miranda';

const rooms: { id: any }[] = [];

const startDatabase = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Limpiar colecciones
    await UserModel.deleteMany({});
    await RoomModel.deleteMany({});
    await BookingModel.deleteMany({});
    await ContactModel.deleteMany({});

    // Crear un usuario aleatorio
    function createRandomUser() {
      const firstname = faker.person.firstName();
      const lastname = faker.person.lastName();
      return new UserModel({
        id: faker.string.uuid(),
        name: faker.internet.userName(),
        work: faker.person.jobTitle(),
        schedule: faker.date.recent().toISOString(),
        photo: [faker.image.avatar()],
        email: faker.internet.email({ firstName: firstname, lastName: lastname }),
        telephone: faker.phone.number(),
        start_date: faker.date.recent().toISOString(),
        description: faker.lorem.sentence(),
        state: faker.helpers.arrayElement(['ACTIVE', 'INACTIVE']),
        password: faker.internet.password(),
      });
    }

    // Crear 10 usuarios aleatorios
    for (let j = 0; j < 10; j++) {
      const newUser = createRandomUser();
      await newUser.save().then(() => console.log("User saved:", newUser)).catch((err) => console.error("Error saving user:", err));
      try {
        await newUser.save();
        console.log(`User ${newUser.name} saved to database`);
      } catch (error) {
        console.error('Error saving user:', error);
      }
    }

    // Crear un usuario administrador
    function createAdminUser() {
      return new UserModel({
        id: '0',
        name: 'admin',
        work: 'admin',
        schedule: new Date('2024-09-17').toISOString(),
        photo: ['https://cdn.fakercloud.com/avatars/calebogden_128.jpg'],
        email: 'admin',
        telephone: '1234567890',
        start_date: new Date('2024-09-01').toISOString(),
        description: 'Admin user description',
        state: 'ACTIVE',
        password: 'admin',
      });
    }

    const admin = createAdminUser();
    try {
      await admin.save();
      console.log('Admin user saved to database');
    } catch (error) {
      console.error('Error saving admin user:', error);
    }

    // Crear una habitación aleatoria
    function createRandomRoom() {
      const price = faker.number.int({ min: 200, max: 500 });
      return new RoomModel({
        id: faker.string.uuid(),
        room_name: faker.lorem.word(),
        amenities: faker.lorem.words(),
        images: [faker.image.urlPicsumPhotos()],
        price: price,
        offer: faker.number.int({ min: 100, max: price }),
        status: faker.helpers.arrayElement(['AVAILABLE', 'BOOKED']),
      });
    }

    // Crear 10 habitaciones aleatorias
    for (let k = 0; k < 10; k++) {
      const newRoom = createRandomRoom();
      try {
        await newRoom.save();
        rooms.push(newRoom);
        console.log(`Room ${newRoom.room_name} saved to database`);
      } catch (error) {
        console.error('Error saving room:', error);
      }
    }

    // Crear una reserva aleatoria
    function createRandomBooking() {
      return new BookingModel({
        id: faker.string.uuid(),
        user: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          room_id: faker.string.uuid(),
        },
        room: {
          roomType: faker.lorem.word(),
          room_id: faker.string.uuid(),
        },
        orderDate: faker.date.recent(),
        checkIn: faker.date.future(),
        checkOut: faker.date.future(),
        status: faker.helpers.arrayElement(['Booked', 'Pending', 'Cancelled', 'Refund']),
        price: faker.number.int({ min: 200, max: 500 }),
        specialRequest: faker.lorem.sentence(),
      });
    }

    // Crear 10 reservas aleatorias
    for (let l = 0; l < 10; l++) {
      const newBooking = createRandomBooking();
      try {
        await newBooking.save();
        console.log('Booking saved to database');
      } catch (error) {
        console.error('Error saving booking:', error);
      }
    }

    // Crear un contacto aleatorio
    function createRandomContact() {
      return new ContactModel({
        Contact_id: faker.string.uuid(),
        Date: faker.date.recent(),
        Customer: faker.internet.userName(),
        Comment: faker.lorem.sentence(),
        gender: faker.person.gender(),
        ip_address: faker.internet.ip(),
        status: faker.helpers.arrayElement(['published', 'archived']),
      });
    }

    // Crear 10 contactos aleatorios
    for (let m = 0; m < 10; m++) {
      const newContact = createRandomContact();
      try {
        await newContact.save();
        console.log('Contact saved to database');
      } catch (error) {
        console.error('Error saving contact:', error);
      }
    }

    console.log('Data generation completed');
  } catch (error) {
    console.error('Database operation error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
};

startDatabase();