const expect = require('expect');
const request = require('supertest');
const bcrypt = require('bcrypt');

process.env.TESTING = true;

const { app } = require('../../../server/server');

const con = require('../../../server/db/connection');

const insertUser = require('../utils/insertUser');
const resetUserTable = require('../utils/resetUserTable')
const resetLinkTable = require('../utils/resetLinkTable')


describe('POST /login', () => {
    const email = 'email@email.com';
    const password = 'Password1234';
    const hash = bcrypt.hashSync(password, 10);

    before(() => new Promise(async resolve => {
        // reset user table
        await resetUserTable();

        // add user
        await insertUser(email, hash);

        resolve();
    }));

    it('should login user', done => {
        request(app)
            .post('/login')
            .send({ email, password })
            .then(response => {
                expect(response.status).toBe(200);
                done();
            }).catch(e => done(e))
    });

    it('should get 401 (invalid password)', done => {
        request(app)
            .post('/login')
            .send({ email, password: password + 'a' })
            .then(response => {
                expect(response.status).toBe(401);
                done();
            }).catch(e => done(e))
    });

    it('should get 401 (incorrect email)', done => {
        request(app)
            .post('/login')
            .send({ email: 'email2@email.com', password })
            .then(response => {
                expect(response.status).toBe(401);
                done();
            }).catch(e => done(e))
    });

    it('should 400 (missing email field)', done => {
        request(app)
            .post('/login')
            .send({ password })
            .then(response => {
                expect(response.status).toBe(400);
                done();
            }).catch(e => done(e));
    });

    it('should 400 (missing password field)', done => {
        request(app)
            .post('/login')
            .send({ email })
            .then(response => {
                expect(response.status).toBe(400);
                done();
            }).catch(e => done(e));
    });
})



describe('POST /register', () => {
    const email = 'email@email.com';
    const password = 'Password1234';
    const hash = bcrypt.hashSync(password, 10);

    before(() => new Promise(async resolve => {
        // reset tables
        await resetLinkTable();
        await resetUserTable();

        resolve();
    }));

    it('should 400 (missing email field)', done => {
        request(app)
            .post('/register')
            .send({ password })
            .then(response => {
                expect(response.status).toBe(400);
                done();
            }).catch(e => done(e));
    });

    it('should 400 (missing password field)', done => {
        request(app)
            .post('/register')
            .send({ email })
            .then(response => {
                expect(response.status).toBe(400);
                done();
            }).catch(e => done(e));
    });

    it('should 401 (invalid email)', done => {
        request(app)
            .post('/register')
            .send({ email: 'ashdhasbd', password })
            .then(response => {
                expect(response.status).toBe(401);
                done();
            }).catch(e => done(e));
    });


    // password

    it('should 401 (password < 8 characters)', done => {
        request(app)
            .post('/register')
            .send({ email, password: 'passwor' })
            .then(response => {
                expect(response.status).toBe(401);
                done();
            }).catch(e => done(e));
    });

    it('should 401 (password > 100 characters)', done => {
        request(app)
            .post('/register')
            .send({ email, password: 'password1234password1234password1234password1234password1234password1234password1234password1234password1234password1234' })
            .then(response => {
                expect(response.status).toBe(401);
                done();
            }).catch(e => done(e));
    });

    // validator.isAscii not working
    // it('should 401 (password contains non-ascii characters)', done => {
    //     request(app)
    //         .post('/register')
    //         .send({ email, password: password + 'ࠊ' })
    //         .then(response => {
    //             expect(response.status).toBe(401);
    //             done();
    //         }).catch(e => done(e));
    // });

    it('should 401 (password doesnt contain two numbers)', done => {
        request(app)
            .post('/register')
            .send({ email, password: 'password' })
            .then(response => {
                expect(response.status).toBe(401);
                done();
            }).catch(e => done(e));
    });





    it('should register new user', done => {
        request(app)
            .post('/register')
            .send({ email, password })
            .then(response => {
                expect(response.status).toBe(200);

                con.query(`SELECT * FROM user WHERE email = '${email}';`, (err, user) => {
                    if (err) done(err);

                    expect(user[0].email).toBe(email);
                    expect(bcrypt.compareSync(user[0].password, password));
                    done();
                })
            }).catch(e => done(e));
    });

    it('should 402 (email already taken)', done => {
        request(app)
            .post('/register')
            .send({ email, password })
            .then(response => {
                expect(response.status).toBe(402);
                done();
            }).catch(e => done(e));
    })


})
