const Tbase = require('mysql');
let host = process.env.HOST;
let user = process.env.USER;
let password = process.env.PASSWORD;
let database = process.env.DATABASE;

const donnedeconnection = {
    host: host,
    user: user,
    password: password,
    database: database
}

module.exports = { donnedeconnection, Tbase };
