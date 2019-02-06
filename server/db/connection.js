const db = require('mysql');

const localConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'linkshortener'
};

const testingConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'test'
};

const connectionOption = process.env.TESTING ? testingConfig : process.env.JAWSDB_MARIA_URL || localConfig;

console.log(process.env.TESTING ? 'Connecting to testing db' : process.env.JAWSDB_MARIA_URL ? 'Connecting to remote db' : 'Connecting to local db')

const con = db.createConnection(connectionOption);


module.exports = con;