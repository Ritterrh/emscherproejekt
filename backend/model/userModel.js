const {connectToDatabase} = require("../database/db");
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
      await connection.execute(
        createNewUserQuery[
          (newUser.firstname, newUser.lastname, newUser.email, newUser.password)
        ],
        (err, res) => {
          if (err) {
            logger.error(err.message);
            cb(err, null);
            return;
          }
          cb(null, {
            id: res.insertId,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            email: newUser.email,
          });
        }
      );
    } catch (err) {
      logger.error(err);
    }
  }

  static async findByEmail(email, cb) {
    try {
      const connection = await connectToDatabase();
      connection.execute(findUserByEmailQuery, email, (err, res) => {
        if (err) {
          logger.error(err.message);
          cb(err, null);
          return;
        }
        if (res.length) {
          cb(null, res[0]);
          return;
        }
        cb({ kind: "not_found" }, null);
      });
    } catch (err) {
      logger.error(err.message);
    }
  }
}

module.exports = User;
