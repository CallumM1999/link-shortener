const con = require('../../../server/db/connection');

module.exports = (fullURL, userID, label, iconURL) => new Promise(resolve => {
    const query = `INSERT INTO link (link, userID, label, icon, disabled) VALUES ('${fullURL}',${userID}, '${label}', '${iconURL}', false);`;
    con.query(query, (err, res) => resolve(res));
});