const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.HOST + ':' + process.env.PORT,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = pool;
