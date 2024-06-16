const express = require("express");
const getAudio = require("../database/getAudio");
const { haversineDistance } = require("../utils/distance");
const { isObjectEmpty } = require("../utils/isObjectEmpty");
const router = express.Router();
const crypto = require("crypto");
router.get("/audio", async (req, res) => {
  const userLatitude = req.query.userLatitude;
  const userLongitude = req.query.userLongitude;
  const userdata = { lat: userLatitude, long: userLongitude };

  try {
    const results = await getAudio.getAudio();
    const latLongArray = results.map((row) => ({
      lat: row.lat,
      long: row.long,
    }));
    const distances = latLongArray.map((coord) =>
      haversineDistance(userdata, coord)
    );
    const audioFilesInRadius = results.filter(
      (row, index) => distances[index] <= 5
    );
    if (isObjectEmpty(audioFilesInRadius)) {
      res.json({
        err: "Keine audio datein im Bereich",
        err_code: "1",
        isError: "true",
      });
    } else {
      res.json({ audioGuids: audioFilesInRadius });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching audio files");
  }
});

router.get("/allaudioguids", async (req, res) => {
  const clientVersion = req.header("Version");
  console.log("Client-Version:", clientVersion);

  try {
    const data = await getAudio.getAllAudioGuids();
    const { long, lat, AudioName, AudioBeschreibung, audioUrl, imageUrl, id } = data[0];
    console.log(AudioName);
    // Prüfen, ob die Client-Version mit der Server-Version übereinstimmt
    let hasChanged = false;
    if(clientVersion === id) {
      console.log("Client-Version: True");
      hasChanged = true;
    }
    for (const audioGuide of data) {
      console.log("AudioGuide:", audioGuide.id.toString());
      if (clientVersion === id) {
        hasChanged = true;
        break;
      }
    }

    if (hasChanged) {
      console.log("Client-Version: True");
      // Auch wenn keine Änderung vorliegt, senden wir die Daten mit Statuscode 200 zurück
      return res.status(200).header("Version", id).json({ data: data });
      
    } else {
      console.log("Client-Version: False");
      // Wenn sich die Daten geändert haben, senden wir ebenfalls die Daten mit Statuscode 200 zurück
      return res.status(200).header("Version", id).json({ data: data });
    
    }
  } catch (error) {
    console.error("Error fetching all audio guids:", error);
    return res.status(500).json({ error: "Failed to fetch audio guids" });
  }
});

module.exports = router;
