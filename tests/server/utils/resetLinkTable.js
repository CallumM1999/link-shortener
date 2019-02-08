const con = require('../../../server/db/connection');

module.exports = () => new Promise(resolve => {
    con.query('DELETE FROM link;', resolve);
});