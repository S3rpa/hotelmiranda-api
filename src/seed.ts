import pool from '../config/db';
import { faker } from '@faker-js/faker';

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