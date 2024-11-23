const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.SQL_HOST + ':' + process.env.SQL_PORT,
    user: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = pool;
