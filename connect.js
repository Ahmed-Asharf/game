const dotenv = require('dotenv');
const mysql = require('mysql');

dotenv.config({ path: './config.env' });

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER_NAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

module.exports = connection;
