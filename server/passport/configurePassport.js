const passport = require('passport');

module.exports = () => {
    passport.serializeUser(function (user, done) {
        console.log('SERIALIZE', user)
        done(null, user);
    });

    passport.deserializeUser(function (id, done) {
        console.log('DESERIALISE, ie checking if valid', id)
        done(null, id);
    });
}