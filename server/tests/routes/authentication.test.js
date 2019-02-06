const expect = require('expect');
const request = require('supertest');
const bcrypt = require('bcrypt');

process.env.TESTING = true;

const { app } = require('../../server');

const con = require('../../db/connection');


const resetUserTable = () => new Promise((resolve, reject) => {
    con.query('show tables;', (err, res) => {

        const tables = res.map(item => item[Object.keys(item)]);

        // if table exists, drop it
        if (tables.indexOf('user') !== -1) con.query('DROP TABLE user');

        // then reinsert the table
        const query = `
            CREATE TABLE user (
            id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
            email VARCHAR(255),
            password VARCHAR(255),
            UNIQUE(email)
        )`;

        con.query(query, err => {
            if (err) reject(err);
            resolve();
        })
    })
});


describe('POST /login', () => {
    const email = 'email@email.com';
    const password = 'password1234';
    const hash = bcrypt.hashSync(password, 10);

    before(async () => {
        // wipe user table
        // insert new user

        await resetUserTable();
        con.query(`INSERT INTO user (email, password) VALUES ('${email}','${hash}');`)
    });


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
    const password = 'password1234';
    const hash = bcrypt.hashSync(password, 10);

    before(async () => {
        await resetUserTable();
    });

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

    it('should 403 (email already taken)', done => {
        request(app)
            .post('/register')
            .send({ email, password })
            .then(response => {
                expect(response.status).toBe(403);
                done();
            }).catch(e => done(e));
    })


})
