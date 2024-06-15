const DB_NAME = "user";

const createDB = `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`;

const dropDB = `DROP DATABASE IF EXISTS ${DB_NAME}`;

const createTableUsers = `
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(50) NULL,
    lastname VARCHAR(50) NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_on TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
)
`;

const createNewUser = `
INSERT INTO users (id, firstname, lastname, email, password, created_on) VALUES (null, ?, ?, ?, ?, NOW())
`;

const findUserByEmail = `
SELECT * FROM users WHERE email = ?
`;

module.exports = {
  createDB,
  dropDB,
  createTableUsers,
  createNewUser,
  findUserByEmail
};
