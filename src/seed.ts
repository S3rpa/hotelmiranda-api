import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { UserModel } from './schemas/userSchema';
import { RoomModel } from './schemas/roomSchema';
import { BookingModel } from './schemas/bookingSchema';
import { ContactModel } from './schemas/contactSchema';
import { UserInterface } from './interfaces/userInterface';
import { Room } from './interfaces/roomsInterface';
import { BookingInterface } from './interfaces/bookingsInterface';
import { Contact } from './interfaces/contactInterface';

dotenv.config();
faker.seed(1234);

const mongoURI = 'mongodb+srv://sergiobarbera1:9mFnNMoBDAzEgSTf@miranda.p0ar9.mongodb.net/Miranda';
let users: UserInterface[] = [];
let rooms: Room[] = [];

const createRandomUser = (): UserInterface => ({
  id: faker.string.uuid(),
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

const createRandomRoom = (): Room => ({
  id: faker.string.uuid(),
  room_name: faker.lorem.word(),
  amenities: faker.lorem.sentence(),
  images: [faker.image.url()],
  price: faker.number.int({ min: 100, max: 500 }),
  offer: faker.number.int({ min: 50, max: 200 }),
  status: faker.helpers.arrayElement(['Available', 'Booked', 'Under Maintenance']),
});

const createRandomBooking = (): BookingInterface => ({
  id: faker.string.uuid(),
  user: users[Math.floor(Math.random() * users.length)]._id!,
  room: rooms[Math.floor(Math.random() * rooms.length)]._id!,
  orderDate: faker.date.recent(),
  checkIn: faker.date.future(),
  checkOut: faker.date.future(),
  status: faker.helpers.arrayElement(['Booked', 'Pending', 'Cancelled', 'Refund']),
  price: faker.number.int({ min: 200, max: 500 }),
  specialRequest: faker.lorem.sentence(),
});

const createRandomContact = (): Contact => ({ 
  Contact_id: faker.string.uuid(),
  Date: faker.date.recent(),
  Customer: faker.person.fullName(),
  Comment: faker.lorem.sentence(),
  gender: faker.person.sex(),
  ip_address: faker.internet.ip(),
  status: faker.helpers.arrayElement(['Active', 'Inactive']),
});

const startDatabase = async () => {
  await mongoose.connect(mongoURI);
  console.log('Connected to MongoDB');

  await UserModel.deleteMany({});
  await RoomModel.deleteMany({});
  await BookingModel.deleteMany({});
  await ContactModel.deleteMany({});
  console.log('Collections cleared');

  for (let i = 0; i < 10; i++) {
    const user = await new UserModel(createRandomUser()).save();
    users.push(user);
    console.log(`User ${user.name} saved to database`);

    const room = await new RoomModel(createRandomRoom()).save();
    rooms.push(room);
    console.log(`Room ${room.room_name} saved to database`);

    await new BookingModel(createRandomBooking()).save();
    console.log('Booking saved to database');

    await new ContactModel(createRandomContact()).save();
    console.log('Contact saved to database');
  }

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
};

startDatabase();