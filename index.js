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

app.get('/api/audio', async (req, res) => {
  const userLatitude = req.query.userLatitude;
  const userLongitude = req.query.userLongitude;
  const userdata = { lat: userLatitude, long: userLongitude };

  try {
    const results = await test();
    const latLongArray = results.map((row) => ({ lat: row.lat, long: row.long }));
    const distances = latLongArray.map((coord) => haversineDistance(userdata, coord));
    const audioFilesInRadius = results.filter((row, index) => distances[index] <= 5);
    if(isObjectEmpty(audioFilesInRadius )){
      res.json({"err": "Keine audio datein im Bereich"})
    }else{
      res.json({ audioFiles: audioFilesInRadius });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Error fetching audio files');
  }
});

app.listen(port, () => {
  console.log(`Server gestartet auf Port ${port}`);
});

function haversineDistance(coord1, coord2) {
  const lat1 = toRadians(coord1.lat);
  const lon1 = toRadians(coord1.long);
  const lat2 = toRadians(coord2.lat);
  const lon2 = toRadians(coord2.long);

  const R = 6371; // Earth's radius in kilometers
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const toRadians = (degrees) => degrees * (Math.PI / 180);