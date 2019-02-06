const con = require('../connection');

module.exports = email => new Promise((resolve, reject) => {
    const query = `SELECT password, id FROM user WHERE email = '${email}' LIMIT 1;`;

    con.query(query, (err, queryResponse) => {
        if (err) throw err;
        resolve(queryResponse);
    })
});
