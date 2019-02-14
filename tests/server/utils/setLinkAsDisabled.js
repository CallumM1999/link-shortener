const con = require('../../../server/db/connection');

module.exports = linkID => new Promise(resolve => {
    const query = `UPDATE link set disabled = 1 where id = ${linkID};`;

    con.query(query, () => {
        resolve();
    })
});