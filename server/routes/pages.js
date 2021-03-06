const express = require('express');
const router = express.Router();

const authenticationMiddleware = require('../middleware/authenticationMiddleware');

const path = require('path');
const publicPath = path.join(__dirname, '..', '..', 'public');

router.get('/', authenticationMiddleware, (req, res) => {
    res.status(200).sendFile(path.join(publicPath, 'index.html'));
})

router.get('/login', (req, res) => {
    res.status(200).sendFile(path.join(publicPath, 'login.html'));
})

router.get('/register', (req, res) => {
    res.status(200).sendFile(path.join(publicPath, 'register.html'));
})

router.get('/preview', (req, res) => {
    res.status(200).sendFile(path.join(publicPath, 'index.html'));
})


router.get('/options/:encodedURL', (req, res) => {
    res.status(200).sendFile(path.join(publicPath, 'options.html'));
})

module.exports = router;