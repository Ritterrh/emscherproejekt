const express = require('express');
const {createAudio} = require('../../helper/db/createAudio')
const router = express.Router();

router.get("/createAudio", async (req, res) => {
    const long              = req.query.long
    const lat               = req.query.lat
    const AudioName         = req.query.AudioName
    const AudioBeschreibung = req.query.AudioBeschreibung
    const audioUrl          = req.query.audioUrl

    try {
       await createAudio(long, lat, AudioName, AudioBeschreibung, audioUrl)
       res.json({"Erfolgreich": "Audio Insert"})
    } catch (err){
        console.warn("Erro")
    }

})

module.exports = router;