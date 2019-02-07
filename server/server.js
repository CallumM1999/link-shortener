const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const configureSession = require('./session/configureSession');
const configurePassport = require('./passport/configurePassport');
const setupDB = require('./db/setupDB');
const session = require('express-session');
const mySqlStore = require('express-mysql-session')(session);

const con = require('./db/connection');
const sessionStore = new mySqlStore({}, con);

con.connect((err) => {
    if (err) throw err;
    if (!process.env.TESTING) setupDB();

    console.log('connected to database');
})

const app = express();
const PORT = process.env.PORT || 3000;

configureSession(app, sessionStore)
configurePassport();

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser())

app.use('/js/', express.static('public/js'));
app.use('/css/', express.static('public/css'));
app.use('/assets/', express.static('public/assets'));

app.use(require('./routes/links'));
app.use(require('./routes/pages'));
app.use(require('./routes/authentication'));

app.listen(PORT, () => console.log('Server running on port', PORT));

module.exports = { app };