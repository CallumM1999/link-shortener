const passport = require('passport');

const con = require('../db/connection');

module.exports = () => {
    passport.serializeUser(function (user, done) {
        console.log('SERIALIZE', user)
        done(null, user);
    });

    passport.deserializeUser(function (id, done) {
        console.log('DESERIALISE', id);

        const query = `SELECT id FROM user WHERE id = '${id}'`;

        con.query(query, (error, user) => {
            if (error) console.log('error', error);
            done(null, id);
        })
    });
}