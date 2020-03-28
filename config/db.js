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

query =  async function (q){
    return new Promise(function(resolve, reject){
        db.query(q, (err, result) => {
            if (result) resolve(result);
            else {
                reject(err);}
        });
    })
}

module.exports = query;