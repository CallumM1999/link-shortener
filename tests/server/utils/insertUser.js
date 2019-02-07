const con = require('../../../server/db/connection');

module.exports = (email, hash) => new Promise((resolve, reject) => {
    const query = `INSERT INTO user (email, password) VALUES ('${email}','${hash}');`;
    con.query(query, () => {
        resolve();
    })
});