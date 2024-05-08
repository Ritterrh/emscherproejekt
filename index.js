const express = require('express');
const app = express();
const cors = require('cors');
const env = require('dotenv').config();
const path = require('path');


const port = env.parsed.PORT;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const AudioDatei = require('./routes/audioDatei');
const AudioRout = require('./routes/audio');
const AudioCreate = require('./routes/dev/newAudios.js')

app.use('/api/dev/v1', AudioCreate)
app.use('/api/v1', AudioDatei);
app.use('/api/v1', AudioRout);



app.listen(port, () => {
  console.log(`Server gestartet auf Port ${port}`);
});

//TODO 1 - Datenbank API endpoint erstellen
//TODO 2 - Docker Container erstellen

