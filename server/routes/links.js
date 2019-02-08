const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const validator = require('validator');
const url = require('url');
const fetch = require('node-fetch');
const con = require('../db/connection');

const encodeURL = id => {
    const map = { 0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', 5: 'f', 6: 'g', 7: 'h', 8: 'i', 9: 'j', a: 'k', b: 'l', c: 'm', d: 'n', e: 'o', f: 'p', g: 'q', h: 'r', i: 's', j: 't', k: 'u', l: 'v', m: 'w', n: 'x', o: 'y', p: 'z' };
    const encoded = id.toString(26).split('').map(item => map[item]).join('');
    return encoded.length < 6 ? encoded + 'a'.repeat(6 - encoded.length) : encoded;
}

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
    const query = `SELECT * FROM link WHERE userID = ${req.user} ORDER BY id DESC;`;

    con.query(query, (err, links) => {
        if (err) return res.status(400).send();

        const formattedLinks = links.map(item => ({
            url: encodeURL(item.id),
            link: item.link,
            label: item.label,
            icon: item.icon,
            visits: 0
        }));

        res.status(200).json(formattedLinks);
    })
})


module.exports = router;