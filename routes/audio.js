const express = require('express');
const { test } = require('../helper/db');   
const { haversineDistance } = require('../helper/distance');
const { isObjectEmpty } = require('../helper/isObjectEmpty');
const router = express.Router();
router.get("/audio", async (req, res) => {
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

module.exports = router ;