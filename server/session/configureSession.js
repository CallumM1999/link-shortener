const session = require('express-session');

module.exports = app => {
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        // cookie: { secure: true }
    }))

}