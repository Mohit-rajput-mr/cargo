// DATABASE DISABLED - Using hardcoded data instead
// const mysql = require('mysql2/promise');

// const pool = mysql.createPool({
//   host: process.env.MYSQL_HOST,
//   port: parseInt(process.env.MYSQL_PORT) || 3306, // Default to 3306 if not specified
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   connectTimeout: 10000, // 10 seconds timeout for establishing connection
// });

// module.exports = pool;

// Temporary mock export for compatibility
module.exports = null;
