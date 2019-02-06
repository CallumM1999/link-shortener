const db = require('mysql');

const localConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'test'
};

console.log(process.env.JAWSDB_MARIA_URL ? 'Connecting to remote db' : 'Connecting to local db')

const con = db.createConnection(process.env.JAWSDB_MARIA_URL || localConfig);


module.exports = con;