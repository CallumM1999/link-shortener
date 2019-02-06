const express = require('express');
const router = express.Router();

const userLogin = require('../db/methods/userLogin');
const userRegister = require('../db/methods/userRegister');

const bcyrpt = require('bcrypt');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send();

    try {
        const queryResponse = await userLogin(email);

        // email not found
        if (!queryResponse.length) return res.status(401).send('user not found');

        // validate password
        const match = await bcyrpt.compare(password, queryResponse[0].password);
        if (!match) return res.status(401).send('invalid password')

        // valid login attempt

        req.login(queryResponse[0].id, err => {
            if (err) console.log('error', err);
            res.status(200).send();
        })
    } catch (e) {
        console.log('there was an error')
        console.log(e)
        res.status(500).send('unexpected error')
    }
});

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send();

    const passwordHash = await bcyrpt.hash(password, 10);

    try {
        const queryResponse = await userRegister(email, passwordHash);

        req.login(queryResponse.insertId, err => {
            if (err) console.log('error', err);
            res.status(200).send();
        })

    } catch (e) {
        if (e === 'ER_DUP_ENTRY') return res.status(403).send('email taken');
        console.log('there was an error')
        console.log(e)
        res.status(500).send('unexpected error')
    }
})

module.exports = router;