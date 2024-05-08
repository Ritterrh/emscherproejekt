const { connectToDatabase } = require('./db');

async function createAudio(long, lat, AudioName, AudioBeschreibung, audioUrl) {
    let connection;
    try {
        connection = await connectToDatabase();
        const sql = 'INSERT INTO `audio_files` (`long`, `lat`, `AudioName`, `AudioBeschreibung`, `audioUrl`) VALUES (?, ?, ?, ?, ?)';
        const values = [long, lat, AudioName, AudioBeschreibung, audioUrl];
        const [results, fields] = await connection.execute(sql, values);
        console.log(results, fields);
        
    
    } catch (err) {
        console.warn(err);
    }
}

module.exports = { createAudio };
