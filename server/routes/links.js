const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const validator = require('validator');
const url = require('url');
const fetch = require('node-fetch');
const con = require('../db/connection');

router.post('/link', authenticationMiddleware, async (req, res) => {
    const { link, label } = req.body;
    if (!link || !label) return res.status(400).send();

    const userID = req.user;

    if (!validator.isURL(link)) return res.status(400).send();
    const parsedURL = url.parse(link);

    // check if icon exists
    const iconURL = `${parsedURL.protocol ? parsedURL.protocol + '//' : ''}${parsedURL.hostname}/favicon.ico`;
    const fetchIconResponse = await fetch(iconURL);
    const iconFound = fetchIconResponse.status == 200 ? true : false;

    let query;

    if (iconFound) {
        query = `INSERT INTO link (link, userID, label, icon) VALUES ('${parsedURL.href}',${userID}, '${label}', '${iconURL}');`;
    } else {
        query = `INSERT INTO link (link, userID, label) VALUES ('${parsedURL.href}',${userID}), '${label}';`;
    }

    con.query(query, (err, result) => {
        if (err) console.log('link err', err)
        console.log('res', result)

        res.status(200).send('added')
    })
});


module.exports = router;