const con = require('../../../server/db/connection');

module.exports = () => new Promise((resolve, reject) => {
    con.query('DROP DATABASE test;', () => {
        resolve();
    });
});