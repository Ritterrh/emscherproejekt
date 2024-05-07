const mysql2 = require('mysql2');
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const env = require('dotenv');
const { test } = require('./helper/db');
const e = require('express');
const { isObjectEmpty } = require('./helper/isObjectEmpty');
env.config();

const port = 3000;
const ordnerPfad = path.join(__dirname, 'audio');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
const AudioRout = require('./routes/audio');

app.use('/api/v1', AudioRout);

app.get('/api/dateien/:dateiname', (req, res) => {
  const dateipfad = path.join(ordnerPfad, req.params.dateiname);
  fs.access(dateipfad, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(err);
      return res.status(404).send('Datei nicht gefunden');
    }
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${req.params.dateiname}"`);
    fs.createReadStream(dateipfad).pipe(res);
  });
});


app.listen(port, () => {
  console.log(`Server gestartet auf Port ${port}`);
});

