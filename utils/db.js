require('dotenv').config();

const { promisify } = require('util')
const mysql = require('mysql')

let db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_DB,
  });

const promiseQuery = promisify(db.query).bind(db);

module.exports = {
  query : promiseQuery,
}