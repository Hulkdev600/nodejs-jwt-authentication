
require('dotenv').config()

module.exports = {

    authentication : {
        host : process.env.DB_HOST,
        port : process.env.DB_PORT,
        user     : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DB_DATABASE,
        options: {
            connectTimeout  : 1000 * 480,
            requestTimeout  : 1000 * 480
        },
        multipleStatements : true
    }
}