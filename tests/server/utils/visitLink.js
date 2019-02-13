const request = require('supertest');
const {app} = require('../../../server/server');

module.exports = url => new Promise(resolve => {
    request(app)
    .get(`/link/${url}`)
    .then(response => resolve());
})