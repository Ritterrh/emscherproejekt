const express = require('express');
const app = express();
const cors = require('cors');
const env = require('dotenv').config();

const port = env.parsed.PORT;

app.use(cors());
app.use(express.json());

const AudioDatei = require('./routes/audioDatei');
const AudioRout = require('./routes/audio');

app.use('/api/v1', AudioDatei);
app.use('/api/v1', AudioRout);

app.listen(port, () => {
  console.log(`Server gestartet auf Port ${port}`);
});

