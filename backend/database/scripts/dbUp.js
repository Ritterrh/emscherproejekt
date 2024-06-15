const { logger } = require('../../utils/logger');
const { createDB: createDBQuery } = require('../queries');

const {connectToDatabase} = require('../db');
async function createDB() {
    try{
        const connection = await connectToDatabase();
        await connection.query(createDBQuery);
        logger.info('DB created!');
    
    }catch(err){
        logger.error(err);
    }
}