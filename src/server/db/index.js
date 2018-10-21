const { Pool, Client } = require("pg");

const pool = new Pool({
  connectionString:
    "postgres://fxckdcwu:Z-74Ub_yQdEr7YaTnjRuMW487LB_NE-I@elmer.db.elephantsql.com:5432/fxckdcwu",
});

pool.query("SELECT NOW()", (err, res) => {
  console.log(err, res);
  pool.end();
});

const client = new Client({
  connectionString:
    "postgres://fxckdcwu:Z-74Ub_yQdEr7YaTnjRuMW487LB_NE-I@elmer.db.elephantsql.com:5432/fxckdcwu",
});

module.exports = client;
