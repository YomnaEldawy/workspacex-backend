const express = require('express');
const app = express();

app.use(express.json());

app.use('/staff', require('./routes/staff'));
app.use('/customer', require('./routes/customer'));

const port = process.env.PORT || 5000;
const server = app.listen(port, ()=>{console.log("Listening on port " + port + "... ")});
module.exports = server;