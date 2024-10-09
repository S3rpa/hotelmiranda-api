import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'my-database-instance.rds.amazonaws.com',
  user: 'root',
  password: '',
  database: 'HotelMiranda',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;