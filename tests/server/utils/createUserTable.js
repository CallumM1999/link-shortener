const con = require('../../../server/db/connection');

module.exports = () => new Promise((resolve, reject) => {
    const query = `
        CREATE TABLE user (
        id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
        email VARCHAR(255),
        password VARCHAR(255),
        UNIQUE(email)
    )`;
    con.query(query, () => {
        resolve();
    })
});