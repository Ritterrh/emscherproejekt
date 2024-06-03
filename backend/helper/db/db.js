async function connectToDatabase(){
    const mysql = require('mysql2/promise')
    const connection = await mysql.createConnection({
        host: "91.200.100.187",
        user: "remote",
        password: "Qb4TwSuH@",
        database: "audio",
    });
    return connection
}

module.exports = {connectToDatabase};
