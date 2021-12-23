const mysql = require('mysql');


const config = require('../config/mysqlConfig');
const dbConnection = mysql.createPool(config.authentication);

module.exports = {

    mysql_exec : (query)=> {
        return new Promise((resolve, reject) => [

            dbConnection.getConnection((err, connection)=> {

                if (err) {
                    console.log('err: ',err);
                }

                connection.query(query, (err, result) => {  //query를 던짐

                    var error = false;  // 에러가 없다면 false
                    if (err) {
                        error = true;  // 에러가 있다면 true
                        console.log(err);  //console창에 error값 출력
                        reject('MySQL 시스템 에러');
                        //console.log(result);

                    }
                    resolve(result);
                    // res.status(200).json(result);


                    connection.release();

                });
            })
        ])
    }
}