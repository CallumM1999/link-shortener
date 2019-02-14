const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const validator = require('validator');
const url = require('url');
const fetch = require('node-fetch');
const con = require('../db/connection');

const path = require('path');
const publicPath = path.join(__dirname, '..', '..', 'public');

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
        query = `INSERT INTO link (link, userID, label, disabled, icon) VALUES ('${fullURL}',${userID}, '${label}', false, '${iconURL}');`;
    } else {
        query = `INSERT INTO link (link, userID, label, disabled) VALUES ('${fullURL}',${userID}, '${label}', false);`;
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
            disabled: item.disabled,
            visits: item.visits
        }));

        res.status(200).json(formattedLinks);
    })
})

router.get('/link/:encodedUrl', async (req, res) => {
    const { encodedUrl } = req.params;
    const decodedUrl = decodeURL(encodedUrl);

    const timestamp = Math.floor(Date.now() / 1000);

    const query = `SELECT link, id, disabled FROM link WHERE id = ${decodedUrl} LIMIT 1; `;

    con.query(query, (err, output) => {
        if (err) return status(404).send();

        if (!output.length) return res.status(404).send();

        // check if list is disabled
        if (output[0].disabled == 1) return res.status(409).sendFile(path.join(publicPath, '404.html'));

        res.status(200).redirect(output[0].link)

        // log request
        const query2 = `INSERT INTO log(linkID, timestamp) VALUES(${output[0].id}, ${timestamp}); `;
        con.query(query2);
    })
})

// disable/re-enable link
router.patch('/link/disable/:encodedUrl', authenticationMiddleware, async (req, res) => {
    const { encodedUrl } = req.params;
    const decodedUrl = decodeURL(encodedUrl);

    const user = req.user;
    const {updateTo} = req.body;

    if (!req.body.hasOwnProperty('updateTo')) return res.status(400).send();
    if (typeof updateTo !== 'boolean') return res.status(400).send();

    const query = `UPDATE link SET disabled = ${updateTo ? 1 : 0} WHERE id = ${decodedUrl} AND userID = ${user} LIMIT 1;`;

    con.query(query, (err, output) => {
        if (err) return res.status(404).send();
        if (output.affectedRows == 0) return res.status(404).send();
        res.status(200).send();
    })
})

router.get('/options/data/:encodedUrl', authenticationMiddleware, async (req, res) => {
    const { encodedUrl } = req.params;
    const decodedUrl = decodeURL(encodedUrl);

    const getLinkData = id => new Promise(resolve => {
        const query = `SELECT * FROM link WHERE id = ${id};`;
        con.query(query, (err, out) => resolve(out))
    })

    const getLogData = linkID => new Promise(resolve => {
        const query = `SELECT * FROM log WHERE linkID = ${linkID}`;
        con.query(query, (err, out) => {
            resolve(out)
        })
    })

    try {
        const result = await Promise.all([
            getLinkData(decodedUrl),
            getLogData(decodedUrl)
        ])

        res.json({
            data: {...result[0][0], url: encodeURL(result[0][0].id)},
            log: result[1]
        })
    } catch(e) {
        // console.log('ERROR', e)
        res.status(404).send();
    }
})


router.delete('/link/:encodedUrl', authenticationMiddleware, async (req, res) => {
    const { encodedUrl } = req.params;
    const decodedUrl = decodeURL(encodedUrl);

    const user = req.user;
    const query = `DELETE FROM link WHERE id = ${decodedUrl} AND userID = ${user};`;

    con.query(query, (err, output) => {
        if (err) return res.status(500).send();
        if (output.affectedRows == 0) return res.status(404).send();
        res.status(200).send();
    })
})

module.exports = router;