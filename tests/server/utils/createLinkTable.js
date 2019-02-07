const con = require('../../../server/db/connection');

module.exports = () => new Promise((resolve, reject) => {
    const query = `CREATE TABLE link (
        id INT PRIMARY KEY AUTO_INCREMENT,
        link VARCHAR(255) NOT NULL,
        label VARCHAR(255) NOT NULL,
        icon VARCHAR(255),
        userID INT NOT NULL,
        FOREIGN KEY (userID) REFERENCES user (id) ON DELETE CASCADE
    );`;
    con.query(query, () => {
        resolve();
    })
});