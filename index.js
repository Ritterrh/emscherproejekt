const sqlite3 = require('sqlite3');
const mysql2 = require('mysql2');
const express = require('express');
const app = express();
const port = 3000;



app.use(express.json());


const db = mysql2.createConnection({
    host: 'data.filmprojekt1.de',
    port: 3306,
    user: 'Rodi',
    password: '1408',
    database: 'EmscherProjekt'
})


// API-Route zum Abrufen von Audio-Dateien im Radius

app.get('/api/audio', (req, res) => {
    const userLatitude = parseFloat(req.query.userLatitude);
    const userLongitude = parseFloat(req.query.userLongitude);
    const radius = 5; // Radius in Kilometern

    db.query('SELECT * FROM audio_files', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: "Serverfehler" });
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

// Funktion zur Berechnung der Entfernung (wie zuvor definiert)
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
