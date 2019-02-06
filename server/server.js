const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const configureSession = require('./session/configureSession');
const configurePassport = require('./passport/configurePassport');

const con = require('./db/connection');

con.connect((err) => {
    if (err) throw err;
    console.log('connected to database')
})

const app = express();
const PORT = process.env.PORT || 3000;

configureSession(app);
configurePassport();

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser())

app.use('/js/', express.static('public/js'));
app.use('/css/', express.static('public/css'));
app.use('/assets/', express.static('public/assets'));

app.use(require('./routes/pages'));
app.use(require('./routes/authentication'));

app.listen(PORT, () => console.log('Server running on port', PORT))