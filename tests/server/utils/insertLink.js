const con = require('../../../server/db/connection');

module.exports = (fullURL, userID, label, iconURL) => new Promise(resolve => {
    const query = `INSERT INTO link (link, userID, label, icon) VALUES ('${fullURL}',${userID}, '${label}', '${iconURL}');`;
    con.query(query, resolve)
});