async function connectToDatabase(){
    const mysql = require('mysql2/promise')
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "Qb4TwSuH",
        database: "audio",
    });
    return connection
}

module.exports = {connectToDatabase};
