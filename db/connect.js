import mysql from 'mysql2/promise';

const connect = mysql.createPool({
  host: '153.92.6.103',
  user: 'u923315908_car_uni',
  password: '@J9qTaaWIT7t',
  database: 'u923315908_car_uni',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Optional: Test the connection when starting the application
(async () => {
  try {
    const connection = await connect.getConnection();
    console.log('Connected to database');
    connection.release();
  } catch (err) {
    console.error('Error connecting to database:', err);
  }
})();

export default connect;