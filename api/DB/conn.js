const mysql = require('mysql');

const Connnection = mysql.createConnection({
    host:process.env.DBHOST ,
    user:process.env.DBUSER,
    password: process.env.DBPASS,
    database:process.env.DB
})

Connnection.connect()

module.exports = Connnection