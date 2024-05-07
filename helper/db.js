const e = require("express");
const mysql = require("mysql2/promise");

async function test() {
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "Qb4TwSuH",
        database: "audio",
    });

    try {
        const [results, fields] = await connection.query("SELECT * FROM `audio_files` ");
        return results;
    } catch (err) {
        console.warn(err);
    } finally {
        await connection.end(); // Close the connection after execution
    }

}

module.exports = { test };
