import { faker } from '@faker-js/faker'
import mongoose from 'mongoose'
import { BookingModel } from './schemas/bookingSchema'
import { ContactModel } from './schemas/contactSchema'
import { RoomModel } from './schemas/roomSchema'
import { UserModel } from './schemas/userSchema'
import dotenv from 'dotenv'

dotenv.config()

const rooms: { id: any }[] = []

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb://root:root@localhost:27017/mongoose?authSource=admin"
    )
    console.log("Connected to MongoDB")

    // Limpiar colecciones
    await UserModel.deleteMany({})
    await RoomModel.deleteMany({})
    await BookingModel.deleteMany({})
    await ContactModel.deleteMany({})

    // Función para crear un usuario aleatorio
    function createRandomUser() {
      const firstname = faker.person.firstName()
      const lastname = faker.person.lastName()
      return new UserModel({
        id: faker.string.uuid(),
        name: faker.internet.userName(),
        work: faker.person.jobTitle(),
        schedule: faker.date.recent(),
        photo: [faker.image.avatar()],
        email: faker.internet.email({ firstName: firstname, lastName: lastname }),
        telephone: faker.phone.number(),
        start_date: faker.date.recent(),
        description: faker.lorem.sentence(),
        state: faker.helpers.arrayElement(['ACTIVE', 'INACTIVE']),
        password: faker.internet.password()
      })
    }

    // Crear 10 usuarios aleatorios
    for (let j = 0; j < 10; j++) {
      const newUser = createRandomUser()
      await newUser.save()
    }

    // Crear un usuario administrador
    function myUser() {
      const password = 'admin'
      return new UserModel({
        id: '0',
        name: 'admin',
        work: 'admin',
        schedule: '2024-09-17',
        photo: ['https://cdn.fakercloud.com/avatars/calebogden_128.jpg'],
        email: 'admin',
        telephone: '1234567890',
        start_date: '2024-09-01',
        description: 'Admin user description',
        state: 'ACTIVE',
        password: password
      })
    }

    const admin = myUser()
    await admin.save()

    // Función para crear una habitación aleatoria
    function createRandomRoom() {
      const price = faker.number.int({ min: 200, max: 500 })
      return new RoomModel({
        id: faker.string.uuid(),
        room_name: faker.lorem.word(),
        amenities: faker.lorem.words(),
        images: [faker.image.urlPicsumPhotos()],
        price: price,
        offer: faker.number.int({ min: 100, max: price }),
        status: faker.helpers.arrayElement(['AVAILABLE', 'BOOKED'])
      })
    }

    // Crear 10 habitaciones aleatorias
    for (let k = 0; k < 10; k++) {
      const newRoom = createRandomRoom()
      await newRoom.save()
      rooms.push(newRoom)
    }
    console.log('Rooms created')

    // Función para crear una reserva aleatoria
    function createRandomAmenity() {
      return {
        name: faker.lorem.word(),
        isFree: faker.datatype.boolean(),
        description: faker.lorem.sentence(),
      }
    }

    function createRandomBooking() {
      return new BookingModel({
        id: faker.string.uuid(),
        name: faker.internet.userName(),
        orderDate: faker.date.recent(),
        checkIn: faker.date.recent(),
        checkOut: faker.date.recent(),
        roomType: faker.lorem.word(),
        status: faker.helpers.arrayElement(['Booked', 'Pending', 'Cancelled', 'Refund']),
        description: faker.lorem.sentence(),
        price: faker.number.int({ min: 200, max: 500 }),
        amenities: faker.helpers.multiple(createRandomAmenity, { count: 3 }),
        specialRequest: faker.lorem.sentence(),
      })
    }

    // Crear 10 reservas aleatorias
    for (let l = 0; l < 10; l++) {
      const newBooking = createRandomBooking()
      await newBooking.save()
    }
    console.log('Bookings created')

    // Función para crear un contacto aleatorio
    function createRandomContact() {
      return new ContactModel({
        Contact_id: faker.string.uuid(),
        Date: faker.date.recent(),
        Customer: faker.internet.userName(),
        Comment: faker.lorem.sentence(),
        gender: faker.person.gender(),
        ip_address: faker.internet.ip(),
        status: faker.helpers.arrayElement(['published', 'archived']),
      })
    }

    // Crear 10 contactos aleatorios
    for (let m = 0; m < 10; m++) {
      const newContact = createRandomContact()
      await newContact.save()
    }

    console.log('Contacts created')

  } catch (error) {
    console.error(error)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
    console.log('Disconnected from MongoDB')
  }
}

start()