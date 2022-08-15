const mysql = require("mysql2");
require("dotenv").config();
const util = require("util");

const connection = mysql.createConnection({
    host: "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.query = util.promisify(connection.query);

module.exports = connection;