import pageHeader from './components/header.js';
import isEmail from 'validator/lib/isEmail';

new Vue({
    el: '#app',
    components: {pageHeader},
    data: function() {
        return {
            email: '',
            email_conf: '',
            password: '',
            password_conf: '',

            error: null,
            loading: false,
            success: false
        }
    },
    methods: {
        handleRegister(e) {
            e.preventDefault();

            if (this.validateRegister()) {
                this.loading = true;

                fetch('register', {
                    method: 'post',
                    body: JSON.stringify({
                        email: this.email,
                        password: this.password
                    }),
                    headers: {"Content-Type": "application/json"},
                }).then(res => {
                    this.loading = false;

                    if (res.status === 200) {
                        this.success = true;
                        window.location = '/';
                    } else {
                        if (res.status === 402) return this.error = 'Email taken!';
                        this.error = 'Oops! Something went wrong.';
                    }
                }).catch(err => {
                    this.loading = false;
                    this.error = 'Oops! Something went wrong.';
                })
            }
            
        },
        validateRegister() {
            if (!this.email || !this.email_conf ||!this.password || !this.password_conf) {
                this.error = `Missing fields!${!this.email? ' email':''}${!this.email_conf ? ' confirm email':''}${!this.password ? ' password':''}${!this.password_conf ? ' password confirm':''}`;
                return;
            }

            // validate email
            if (!isEmail(this.email)) {
                this.error = 'Invalid email!';
                return;
            } else if (this.email !== this.email_conf) {
                this.error = 'Email doesn\'t match!';
                return;
            }

            // validate password
            // rules :
            // ===========
            // length 8 - 100
            // contain 1 number
            // contain 1 capital letter
            // ascii i.e. [\x00-\x7F]

            const match = this.password.match(/(?=^([\x00-\x7F]{8,100})$)(?=[\x00-\x7F]*[0-9][\x00-\x7F]*)(?=[\x00-\x7F]*[A-Z][\x00-\x7F]*)/);

            if (!match) {
                this.error = 'Invalid Password! Must be 8-100 characters and contain 1 Number and 1 Capital Letter.';
                return;
            } else if (this.password !== this.password_conf) {
                this.error = 'Password doesn\'t match!';
                return;
            }

            this.error = null;
            return true;
        }
    }
})

