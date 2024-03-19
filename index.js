const mysql2 = require('mysql2');
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const env = require('dotenv');
env.config();

const port = 3000;

const ordnerPfad = path.join(__dirname, 'audio');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json());
const db = mysql2.createConnection({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_NAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE
})



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



app.get('/api/audio', (req, res) => {
    const userLatitude = parseFloat(req.query.userLatitude);
    const userLongitude = parseFloat(req.query.userLongitude);
    const radius = 5; // Radius in Kilometern
    
    db.query('SELECT * FROM audio_files', (err, rows) => {
        if (err) {
            console.error(err.message);
           
   
            return;
        }

        const audioFilesInRadius = rows.filter(row => {
            const distance = calculateDistance(userLatitude, userLongitude, row.latitude, row.longitude);
            return distance <= radius;
        });

        res.json({ audioFiles: audioFilesInRadius });
    });
});




app.listen(port, () => {
    console.log(`Server gestartet auf Port ${port}`);
});




function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Erdradius in Kilometern
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}
