const { Pool } = require('pg');
require('dotenv').config();
const databaseConnectionError = require('../../error/handlers/databaseConnectionError');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

pool.connect()
    .then((client) => {
        console.log('Connected to PostgreSQL');
        client.release();
    })
    .catch(databaseConnectionError);

module.exports = pool;