const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const ordnerPfad = path.join(__dirname, 'audio');


router.get('/file/:dateiname', (req, res) => {
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
  
module.exports = router;