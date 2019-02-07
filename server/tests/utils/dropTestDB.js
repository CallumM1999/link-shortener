const con = require('../../db/connection');

module.exports = () => new Promise((resolve, reject) => {
    con.query('DROP DATABASE test;', () => {
        resolve();
    });
});