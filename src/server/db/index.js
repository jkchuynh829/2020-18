const { Pool, Client } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://canoc:password@localhost:5432/money202018'
});

pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res)
    pool.end()
});

const client = new Client({
    connectionString: 'postgresql://canoc:password@localhost:5432/money202018'
});

module.exports = client;