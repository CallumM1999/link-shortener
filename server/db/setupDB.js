const con = require('./connection');

module.exports = () => {
    console.log('checking that database is setup with tables');

    // required tables ['user']

    con.query('SHOW tables;', (err, res) => {
        const tables = res.map(item => {
            const key = Object.keys(item);
            return item[key];
        });

        console.log('setup tables:', tables)

        if (tables.indexOf('user') === -1) {
            con.query(`CREATE TABLE user (
                id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
                email VARCHAR(255),
                password VARCHAR(255),
                UNIQUE(email)
            )`)
        }
    })
}
