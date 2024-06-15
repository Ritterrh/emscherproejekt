const User = require("../model/userModel");
const { logger } = require("../utils/logger");
const {
  hash: hashPassword,
  compare: comparePassword,
} = require("../utils/password");
const { generate: generateToken } = require("../utils/token");

exports.signup = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const hashedPassword = hashPassword(password.trim());

    const user = new User(
      firstname.trim(),
      lastname.trim(),
      email.trim(),
      hashedPassword
    );

    User.create(user, (err, data) => {
      if (err) {
        logger.info("response: ");
        return res.status(500).send({
          status: "error",
          message: err.message,
        });
      }
      const token = generateToken(data.id);
      logger.info("response: "); 

      res.status(201).send({
        status: "success",
        data: {
          token,
          data,
        },
      });
    });
  } catch (err) {
    logger.info("response: ");
    res.status(500).send({
      status: "error",
      message: err.message,
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    User.findByEmail(email.trim(), (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
            logger.info("response: ");
          return res.status(404).send({
            status: "error",
            message: `User with email ${email} was not found`,
          });
        }
        logger.info("response: ");
        return res.status(500).send({
          status: "error",
          message: err.message,
        });
      }

      if (data) {
        if (comparePassword(password.trim(), data.password)) {
          const token = generateToken(data.id);
          logger.info("response: ");
          return res.status(200).send({
            status: "success",
            data: {
              token,
              firstname: data.firstname,
              lastname: data.lastname,
              email: data.email,
            },
          });
        } else {
            logger.info("response: ");
          return res.status(401).send({
            status: "error",
            message: "Incorrect password",
          });
        }
      } else {
        logger.info("response: ");
        return res.status(500).send({
          status: "error",
          message: "An unexpected error occurred",
        });
      }
    });
  } catch (err) {
    logger.info("response: ");
    res.status(500).send({
      status: "error",
      message: err.message,
    });
  }
};
