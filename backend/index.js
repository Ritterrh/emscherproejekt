const express = require("express");
const app = express();
const cors = require("cors");
const env = require("dotenv").config();
const path = require("path");
const logger = require("./utils/logger");

const port = 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const AudioDatei = require("./routes/audioDatei");
const AudioRout = require("./routes/audio");
const AudioCreate = require("./routes/dev/newAudios.js");

const ChangeLog = require("./routes/changelog.js");

const Auth = require("./routes/auth.js");
const { log } = require("console");

app.use("/dev/v1", AudioCreate);
app.use("/v1", AudioDatei);
app.use("/v1", AudioRout);
app.use("/v1", ChangeLog);
var a = app.use("/v1/auth", Auth);
a;
logger.logger.info(a);
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({
    status: "error",
    message: err.message,
  });
  next();
});

app.listen(port, () => {
  logger.logger.info(`Server gestartet auf Port ${port}`);
});

//TODO 1 - Datenbank API endpoint erstellen
//TODO 2 - Docker Container erstellen
