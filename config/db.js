const mysql = require("mysql");

const db = mysql.createConnection({
  database: process.env.dbName,
  host: "127.0.0.1",
  user: "root",
  password: process.env.dbpassword
});

db.connect(err => {
  if (err) {
    return console.log("Error connecting to db", err);
  }
});

query = async function(q) {
  return new Promise(function(resolve, reject) {
    db.query(q, (err, result) => {
      if (result) resolve(result);
      else {
        reject(err);
      }
    });
  });
};

module.exports = query;
