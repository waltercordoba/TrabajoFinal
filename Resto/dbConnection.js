var mysql = require('mysql');
var connections = mysql.createConnection({
    user: "root",
    password: "123",
    database: "resto",
    host: "localhost",
    connectionLimit: 10
  });
  module.exports = connections;