async function connectToDatabase() {
  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection({
    host: "91.200.100.187",
    user: "remote",
    password: "Qb4TwSuH@",
    database: "rke",
  });
  return connection;
}
const mysql = require("mysql2");
const pool = mysql.createPool({
  host: "91.200.100.187", 
  user: "remote", 
  password: "Qb4TwSuH@", 
  database: "rke",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = { connectToDatabase};
