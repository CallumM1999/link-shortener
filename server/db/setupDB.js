const con = require('./connection');

module.exports = () => {
    console.log('checking that database is setup with tables');

    // required tables ['user', 'link']

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

        if (tables.indexOf('link') === -1) {
            con.query(`CREATE TABLE link (
                id INT PRIMARY KEY AUTO_INCREMENT,
                link VARCHAR(255) NOT NULL,
                label VARCHAR(255) NOT NULL,
                icon VARCHAR(255),
                userID INT NOT NULL,
                FOREIGN KEY (userID) REFERENCES user (id) ON DELETE CASCADE
            );`)
        }
    })
}
