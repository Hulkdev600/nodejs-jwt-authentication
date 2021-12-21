
require('dotenv').config({path : '../info.env'})

// console.log('a',process.env.DB_HOST)
// console.log('b',process.env.DB_PORT)
// console.log('c',process.env.USER)
// console.log('d',process.env.PORT)
// console.log('c',process.env.)

module.exports = {

    authentication : {
        host : process.env.DB_HOST,
        port : process.env.DB_PORT,
        user     : process.env.USER,
        password : process.env.PASS,
        database : process.env.DATABASE,
        options: {
            connectTimeout  : 1000 * 480,
            requestTimeout  : 1000 * 480
        },
        multipleStatements : true
    }
}