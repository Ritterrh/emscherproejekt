const { connectToDatabase } = require("../database/db");
const {
  createNewUser: createNewUserQuery,
  findUserByEmail: findUserByEmailQuery,
} = require("../database/queries");
const { logger } = require("../utils/logger");

class User {
  constructor(firstname, lastname, email, password) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
  }

  static async create(newUser, cb) {
    try {
      const connection = await connectToDatabase();
      try {
        const [res] = await connection.execute(createNewUserQuery, [
          newUser.firstname,
          newUser.lastname,
          newUser.email,
          newUser.password,
        ]);
        cb(null, {
          id: res.insertId,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          email: newUser.email,
        });
      } finally {
        connection.end();
      }
    } catch (err) {
      logger.error(err.message);
      cb(err, null);
    }
  }

  static async findByEmail(email, cb) {
    try {
      const connection = await connectToDatabase();
      try {
        const [res] = await connection.execute(findUserByEmailQuery, [email]);
        if (res.length) {
          cb(null, res[0]);
          return;
        }
        cb({ kind: "not_found" }, null);
      } finally {
        connection.end();
      }
    } catch (err) {
      logger.error(err.message);
      cb(err, null);
    }
  }
}

module.exports = User;
