const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "agustin1",
  database: "dbfarmacia",
});

module.exports = { connection };
