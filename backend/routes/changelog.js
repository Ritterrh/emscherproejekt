const express = require('express');
const router = express.Router();

router.get('/changelog', async (req, res) => {
    res.json({
        "changelogs": {
            "title": "Test",
            "description": "Beschreibung",
            "version": "2.11",
            "published_at": "Heute",
            "content": "Test Content"
        }
    })
})

module.exports = router