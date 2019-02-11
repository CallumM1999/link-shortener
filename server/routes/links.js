const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const validator = require('validator');
const url = require('url');
const fetch = require('node-fetch');
const con = require('../db/connection');

const encodeURL = require('../utils/encodeURL');
const decodeURL = require('../utils/decodeURL');

router.post('/link', authenticationMiddleware, async (req, res) => {
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

        res.status(200).json({
            url: encodeURL(result.insertId),
            link: fullURL,
            icon: iconURL,
            label,
            visits: 0
        })
    })
});

router.get('/link', authenticationMiddleware, async (req, res) => {
    const query = `SELECT link.*, COUNT(log.linkID) AS visits FROM link LEFT JOIN log ON log.linkID = link.id WHERE link.userID = ${req.user} GROUP BY link.id;`;

    con.query(query, (err, links) => {
        if (err) return res.status(400).send();

        const formattedLinks = links.map(item => ({
            url: encodeURL(item.id),
            link: item.link,
            label: item.label,
            icon: item.icon,
            visits: item.visits
        }));

        res.status(200).json(formattedLinks);
    })
})

router.get('/link/:encodedUrl', async (req, res) => {
    const { encodedUrl } = req.params;
    const decodedUrl = decodeURL(encodedUrl);

    // console.log('request', req.http)

    // console.log('body', req.body)

    const timestamp = Math.floor(Date.now() / 1000);

    console.log('time', timestamp)

    const query = `SELECT link, id FROM link WHERE id = ${decodedUrl} LIMIT 1; `;

    con.query(query, (err, output) => {
        console.log('first query')
        if (err) return status(404).send();

        if (!output.length) return res.status(404).send();



        res.status(200).redirect(output[0].link)

        // log request

        const query2 = `INSERT INTO log(linkID, timestamp) VALUES(${output[0].id}, ${timestamp}); `;

        con.query(query2, (err, res) => {
            console.log('logged')

            if (err) console.log('log err', err);

            console.log('log res', res)



        })

    })
})

module.exports = router;