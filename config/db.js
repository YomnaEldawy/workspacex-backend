const mysql = require('mysql');

const db = mysql.createConnection ({
    database: 'workspacex',
    host: '127.0.0.1',
    user: 'root',
    password: process.env.dbpassword
});

db.connect( (err) => {
    if(err) {
        return console.log(err);}
    db.query('use wsxdemo');
});

db.executeQuery =  async function (query){
    return new Promise(function(resolve, reject){
        db.query(query, (err, result) => {
            if (result) resolve(result);
            else {
                reject(err);}
        });
    })
}

module.exports = db;