const con = require('../../../server/db/connection');

module.exports = () => new Promise((resolve, reject) => {
    con.query('CREATE DATABASE test;', () => {
        con.query('USE test;', () => {
            resolve();
        })
    });
});