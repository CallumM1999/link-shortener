const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const validator = require('validator');
const url = require('url');
const fetch = require('node-fetch');
const con = require('../db/connection');

router.post('/link', authenticationMiddleware, async (req, res) => {
    console.log('LINK')
    const { link, label } = req.body;
    if (!link || !label) return res.status(400).send();

    if (label.length > 30) return res.status(400).send();

    const userID = req.user;

    if (!validator.isURL(link)) return res.status(400).send();

    // check that url starts with protocol
    if (!link.match(/^(http:\/\/)|(https:\/\/)/)) return res.status(400).send();

    const parsedURL = url.parse(link);

    // check if icon exists
    const fullURL = `${parsedURL.protocol}//${parsedURL.hostname}${parsedURL.path}`;
    const iconURL = `${parsedURL.protocol}//${parsedURL.hostname}/favicon.ico`;

    let iconFound = false;

    try {
        // try fetch icon
        const fetchIconResponse = await fetch(iconURL);
        iconFound = fetchIconResponse.status == 200 ? true : false;
    } catch (e) { }

    let query;

    if (iconFound) {
        query = `INSERT INTO link (link, userID, label, icon) VALUES ('${fullURL}',${userID}, '${label}', '${iconURL}');`;
    } else {
        query = `INSERT INTO link (link, userID, label) VALUES ('${fullURL}',${userID}, '${label}');`;
    }

    con.query(query, (err, result) => {
        if (err) return res.status(400).send();
        console.log('res', result)

        res.status(200).json({
            id: result.insertId,
            url: fullURL,
            icon: iconURL,
            label
        })
    })

});


module.exports = router;