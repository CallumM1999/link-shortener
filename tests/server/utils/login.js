const request = require('supertest');
const { app } = require('../../../server/server');

module.exports = (email, password) => new Promise(resolve => {
    request(app)
        .post('/login')
        .send({ email, password })
        .then(response => {
            cookie = response.header['set-cookie'][0];
            resolve(cookie);
        })
});