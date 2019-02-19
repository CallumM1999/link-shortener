import pageHeader from './components/header.js';
import isEmail from 'validator/lib/isEmail';

import shakeError from './animations/shakeError';
import fadeIn from './animations/fadeIn';
import fadeOut from './animations/fadeOut';

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
                        if (res.status === 401) return this.displayError('Invalid email or password!');
                        this.displayError('Oops! Something went wrong.');
                    }
                }).catch(() => {
                    this.loading = false;
                    this.displayError('Oops! Something went wrong.');
                })
            }
        },
        validateLogin() {

            if (!this.email || !this.password) {
                this.displayError(`Missing fields!${!this.email? ' email':''}${!this.password ? ' password':''}`);
                return;
            }

            // validate email
            if (!isEmail(this.email)) {
                this.displayError('Invalid email!')
                return;
            }

            this.error = null;
            return true;
        },
        displayError(errorMsg) {
            this.error = errorMsg;
            shakeError(this.$refs.loginBtn);
        },

        // animations
        enter: fadeIn,
        leave: fadeOut,
    },
    
})
