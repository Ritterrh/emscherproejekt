const {connectToDatabase }=require('./db')

async function getAudio(){
    let connection
    try {
        connection = await connectToDatabase;
        const [results, fields] = await (await connection()).query("SELECT * FROM `audio_files` ");
        return results  
    } catch (err){
        console.warn(err)
    } finally {
        (await connection()).end();
    }

}


module.exports = { getAudio }