const express = require('express');
const router = express.Router();

const path = require('path');
const publicPath = path.join(__dirname, '..', '..', 'public');

const passport = require('passport');




router.post('/login', (req, res) => {
    console.log('login', req.body)

    const { email, password } = req.body;

    console.log('credentials', email, password)

    req.login('memes', err => {
        console.log('LOGIN')
        if (err) console.log('error', err);


    })


    res.json({ status: 'success' });
})


module.exports = router;