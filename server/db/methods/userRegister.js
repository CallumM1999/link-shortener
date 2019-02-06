const con = require('../connection');

module.exports = (email, password) => new Promise((resolve, reject) => {
    const query = `INSERT INTO user (email, password) VALUES ('${email}','${password}');`;

    con.query(query, (err, queryResponse) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return reject(err.code);
            throw err;
        }

        resolve(queryResponse);
    })
});