const express = require('express');
const router = express.Router();

const path = require('path');
const publicPath = path.join(__dirname, '..', '..', 'public');


router.get('*', (req, res) => {
    res.status(404).sendFile(path.join(publicPath, '404.html'));
})

module.exports = router;