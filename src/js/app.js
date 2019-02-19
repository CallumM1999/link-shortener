import pageHeader from './components/header.js';

import shakeError from './animations/shakeError';
import fadeIn from './animations/fadeIn';
import fadeOut from './animations/fadeOut';

// require('../scss/main.scss');

// console.log('ENVIRONMENT', process.env.NODE_ENV)
// if (process.env.NODE_ENV === 'development') {
//     require('../../public/index.html')
// }

import isURL from 'validator/lib/isURL';

new Vue({
    el: '#app',
    components: {pageHeader},
    data() {
        return {
            links: [],
            filteredLinks: [],
            visibleLinks: [],

            filter: '',
            nextIndex: 0,

            loading: true,

            listDisplayList: true,

            createInputLink: '',
            createInputLabel: '',
            createMsg: null, // {type: ('error' or 'success'), msg: 'some message'}

            forceGrid: window.innerWidth <= 700 ? true : false,
        }

    },
    mounted() {
        console.log('vue mounted')

        window.addEventListener('resize', () => {
            this.forceGrid = window.innerWidth <= 700 ? true : false;
        })

        fetch('/link', { method: 'GET' })
            .then(response => response.json())
            .then(response => {
                // update links array
                this.links = response;
                this.updateVisibleLinks()

                this.loading = false;
            })
    },
    watch: {
        filter() {
            this.nextIndex = 0;
            this.filteredLinks = this.links.filter((item) => {
                const label = item.label.toLowerCase();
                const link = item.link.replace('https://', '').replace('http://', '').toLowerCase();

                const filter = this.filter.toLowerCase();
                return label.includes(filter) || link.includes(filter);
            });

            this.visibleLinks = this.filteredLinks.slice(0, 6)
        },

    },
    methods: {
        handleNext() {
            if (this.filteredLinks.length - ((this.nextIndex + 1) * 6) > 0) {
                this.nextIndex++;
                this.updateVisibleLinks();
            }
        },
        handlePrevious() {
            if (this.nextIndex > 0) {
                this.nextIndex--;
                this.updateVisibleLinks();
            }
        },
        toggleListDisplayOption() {
            this.listDisplayList = !this.listDisplayList;
        },
        updateVisibleLinks() {
            this.filteredLinks = this.links;
            this.visibleLinks = this.filteredLinks.slice(this.nextIndex * 6, Math.min((this.nextIndex * 6) + 6, this.filteredLinks.length))

        },
        addLink(e) {
            e.preventDefault();       
     
            // prevent spam
            if (this.createMsg && this.createMsg.status === 'loading') return;

            //validate link
            if (!this.createInputLink.length) return this.error('Please add a link');
            if (!isURL(this.createInputLink)) return this.error('Link must be valid')
            if (!this.createInputLink.match(/^(http:\/\/)|(https:\/\/)/)) return this.error('Link must start with http:// or https://');

            // validate label
            if (!this.createInputLabel.length) return this.error('Please add a label')
            if (this.createInputLabel.length > 30) return this.error('Label must be less than 30 characters');

            // if no errors, send request
            this.createMsg = { type: 'loading' }

            fetch('/link', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Cache': 'no-cache'
                },
                credentials: 'include',
                body: JSON.stringify({
                    link: this.createInputLink,
                    label: this.createInputLabel
                })
            })
                .then(response => {
                    if (response.status !== 200) return this.error('Oops! Something went wrong.')

                    this.success();

                    response.json().then(val => {
                        this.links.unshift(val);
                        this.updateVisibleLinks();
                    })
                })
        },
        loading() {

        },
        success() {
            this.createMsg = { type: 'success', msg: 'Link added!' };

            this.createInputLabel = '';
            this.createInputLink = '';
        },
        error(msg) {
            this.createMsg = { type: 'error', msg };

            shakeError(this.$refs.addLinkBtn)
        },
        closeMessage() {
            this.createMsg = null;
        }, 

        // animations
        enter: fadeIn,
        leave: fadeOut,
    }
})