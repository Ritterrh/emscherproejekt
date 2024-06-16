const { connectToDatabase } = require("./db");

async function getAudio() {
  let connection;
  try {
    connection = await connectToDatabase;
    const [results, fields] = await (
      await connection()
    ).query("SELECT * FROM `audioGuids` ");
    return results;
  } catch (err) {
    console.warn(err);
  } finally {
    (await connection()).end();
  }
}

async function getAllAudioGuids() {
  try {
    const connection = await connectToDatabase();
    const [results, fields] = await connection.query(
      "SELECT * FROM `audioGuids`"
    );
    return results;
  } catch (err) {
    console.warn(err);
  }
}
module.exports = { getAudio, getAllAudioGuids };
