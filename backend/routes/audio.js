const express = require('express');
const getAudio = require('../database/getAudio')
const { haversineDistance } = require('../utils/distance');
const { isObjectEmpty } = require('../utils/isObjectEmpty');
const router = express.Router();
router.get("/audio", async (req, res) => {
    const userLatitude = req.query.userLatitude;
    const userLongitude = req.query.userLongitude;
    const userdata = { lat: userLatitude, long: userLongitude };
  
    try {
      const results = await getAudio.getAudio();
      const latLongArray = results.map((row) => ({ lat: row.lat, long: row.long }));
      const distances = latLongArray.map((coord) => haversineDistance(userdata, coord));
      const audioFilesInRadius = results.filter((row, index) => distances[index] <= 5);
      if(isObjectEmpty(audioFilesInRadius )){
        res.json({
          "err": "Keine audio datein im Bereich",
          "err_code": "1",
          "isError": "true"
        })
      }else{
        res.json({ audioGuids: audioFilesInRadius });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send('Error fetching audio files');
    }
});

module.exports = router ;