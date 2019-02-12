import pageHeader from './components/header.js';
import isEmail from 'validator/lib/isEmail';

new Vue({
    el: '#app',
    components: {pageHeader},
    data: function() {
        return {
            email: '',
            password: '',
            error: null,
            loading: false,
            success: false,
        }
    },

    methods: {
        handleLogin(e) {
            e.preventDefault();
        
            if (this.validateLogin() && !this.loading) {
                this.loading = true;

                fetch('login', {
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
                        if (res.status === 401) return this.error = 'Invalid email or password!';
                        this.error = 'Oops! Something went wrong.';
                    }
                }).catch(() => {
                    this.loading = false;
                    this.error = 'Oops! Something went wrong.';
                })
            }
        },
        validateLogin() {
            if (!this.email || !this.password) {
                this.error = `Missing fields!${!this.email? ' email':''}${!this.password ? ' password':''}`;
                return;
            }

            // validate email
            if (!isEmail(this.email)) {
                this.error = 'Invalid email!';
                return;
            }

            this.error = null;
            return true;
        }
    },
    
})
