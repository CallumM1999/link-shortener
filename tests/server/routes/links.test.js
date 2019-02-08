const expect = require('expect');
const request = require('supertest');
const bcrypt = require('bcrypt');

process.env.TESTING = true;

const { app } = require('../../../server/server');

const con = require('../../../server/db/connection');

const insertUser = require('../utils/insertUser');
const resetUserTable = require('../utils/resetUserTable')
const resetLinkTable = require('../utils/resetLinkTable')

describe('POST /link', () => {
    const email = 'email@email.com';
    const password = 'password1234';
    const hash = bcrypt.hashSync(password, 10);

    const link = 'https://github.com/CallumM1999/link-shortener/blob/master/README.md';
    const label = 'Github';

    let cookie;

    before(() => new Promise(async resolve => {
        // reset tables;
        await resetLinkTable();
        await resetUserTable();

        // create user
        await insertUser(email, hash);

        request(app)
            .post('/login')
            .send({ email, password })
            .then(response => {

                cookie = response.header['set-cookie'][0];

                resolve();
            })

    }));


    it('should add new link', done => {
        request(app)
            .post('/link')
            .send({ link, label })
            .set('Cookie', [cookie])
            .then(response => {
                expect(response.status).toBe(200);

                const query = `SELECT * FROM link WHERE link='${link}';`;

                con.query(query, (err, res) => {
                    expect(res[0].label).toEqual(label)
                    done();
                })
            })
    })

    it('should 400 (no label)', done => {
        request(app)
            .post('/link')
            .send({ link })
            .set('Cookie', [cookie])
            .then(response => {
                expect(response.status).toBe(400);
                done();
            })
    });

    it('should 400 (label too long)', done => {
        request(app)
            .post('/link')
            .send({ link, label: ('a').repeat(31) })
            .set('Cookie', [cookie])
            .then(response => {
                expect(response.status).toBe(400);
                done();
            })
    })

    it('should 400 (no link)', done => {
        request(app)
            .post('/link')
            .send({ label })
            .set('Cookie', [cookie])
            .then(response => {
                expect(response.status).toBe(400);
                done();
            })
    })

    it('should 400 (invalid link)', done => {
        request(app)
            .post('/link')
            .send({ link: 'ajsdnajsdn', label })
            .set('Cookie', [cookie])
            .then(response => {
                expect(response.status).toBe(400);
                done();
            })
    })

    it('should 400 (link without protocol)', done => {
        request(app)
            .post('/link')
            .send({ link: 'google.com', label })
            .set('Cookie', [cookie])
            .then(response => {
                expect(response.status).toBe(400);
                done();
            })
    })
})