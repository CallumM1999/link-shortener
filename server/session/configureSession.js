const session = require('express-session');

module.exports = (app, sessionStore) => {
    if (!process.env.cookie_secret) throw 'No cookie secret'
    app.use(session({
        key: 'session_cookie_name',
        secret: process.env.cookie_secret,
        store: sessionStore,
        resave: true,
        saveUninitialized: false,
        rolling: true,
        cookie: {
            maxAge: (1000 * 60 * 60 * 24 * 7 ) , // 1 week
        },
    }));
}