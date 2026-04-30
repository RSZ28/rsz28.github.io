const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true
  }
};

async function getUsers() {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request().query('SELECT TOP 10 * FROM Users');

    return result.recordset;
  } catch (err) {
    console.error("DB ERROR:", err);
    throw err;
  }
}

module.exports = { getUsers };