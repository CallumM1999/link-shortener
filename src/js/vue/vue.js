new Vue({
    el: '#app',
    data: {
        links: [
            {
                label: 'Github',
                icon: 'https://github.com/favicon.ico',
                link: 'ab6hddn9',
                fullLink: 'https://github.com/callumm1999',
                visits: 2
            },
            {
                label: 'Github',
                icon: '/assets/defaultIcon.png',
                link: 'ab6hddn9',
                fullLink: 'https://github.com/callumm1999',
                visits: 23
            },
            {
                label: 'Amazon',
                icon: 'https://amazon.co.uk/favicon.ico',
                link: 'ab6hddn9',
                fullLink: 'https://www.amazon.co.uk/',
                visits: 8
            },
            {
                label: 'Ebay',
                icon: 'https://www.ebay.co.uk/favicon.ico',
                link: 'ab6hddn9',
                fullLink: 'https://www.ebay.co.uk/',
                visits: 0
            }, {
                label: 'Github',
                icon: 'https://github.com/favicon.ico',
                link: 'ab6hddn9',
                fullLink: 'https://github.com/callumm1999',
                visits: 2
            },
            {
                label: 'Github',
                icon: '/assets/defaultIcon.png',
                link: 'ab6hddn9',
                fullLink: 'https://github.com/callumm1999',
                visits: 23
            },
            {
                label: 'Amazon',
                icon: 'https://amazon.co.uk/favicon.ico',
                link: 'ab6hddn9',
                fullLink: 'https://www.amazon.co.uk/',
                visits: 8
            },
            {
                label: 'Ebay',
                icon: 'https://www.ebay.co.uk/favicon.ico',
                link: 'ab6hddn9',
                fullLink: 'https://www.ebay.co.uk/',
                visits: 0
            }, {
                label: 'Github',
                icon: 'https://github.com/favicon.ico',
                link: 'ab6hddn9',
                fullLink: 'https://github.com/callumm1999',
                visits: 2
            },
            {
                label: 'Github',
                icon: '/assets/defaultIcon.png',
                link: 'ab6hddn9',
                fullLink: 'https://github.com/callumm1999',
                visits: 23
            },
            {
                label: 'Amazon',
                icon: 'https://amazon.co.uk/favicon.ico',
                link: 'ab6hddn9',
                fullLink: 'https://www.amazon.co.uk/',
                visits: 8
            },
            {
                label: 'Ebay',
                icon: 'https://www.ebay.co.uk/favicon.ico',
                link: 'ab6hddn9',
                fullLink: 'https://www.ebay.co.uk/',
                visits: 0
            },
            {
                label: 'Github',
                icon: '/assets/defaultIcon.png',
                link: 'ab6hddn9',
                fullLink: 'https://github.com/callumm1999',
                visits: 23
            },
            {
                label: 'Amazon',
                icon: 'https://amazon.co.uk/favicon.ico',
                link: 'ab6hddn9',
                fullLink: 'https://www.amazon.co.uk/',
                visits: 8
            },
            {
                label: 'Ebay',
                icon: 'https://www.ebay.co.uk/favicon.ico',
                link: 'ab6hddn9',
                fullLink: 'https://www.ebay.co.uk/',
                visits: 0
            }
        ],
        filteredLinks: [],
        visibleLinks: [],
        filter: '',
        nextIndex: 0,



        listDisplayList: true,

    },
    mounted() {
        console.log('vue mounted')

        this.filteredLinks = this.links;
        this.visibleLinks = this.filteredLinks.slice(0, 6)
    },
    watch: {
        filter() {
            this.nextIndex = 0;
            this.filteredLinks = this.links.filter((item) => {
                const label = item.label.toLowerCase();
                const filter = this.filter.toLowerCase();
                return label.includes(filter);
            });

            this.visibleLinks = this.filteredLinks.slice(0, 6)
        },
        nextIndex(index) {
            this.visibleLinks = this.filteredLinks.slice(index * 6, Math.min((index * 6) + 6, this.filteredLinks.length))
        }
    },
    methods: {
        handleNext() {
            if (this.filteredLinks.length - ((this.nextIndex + 1) * 6) > 0) {
                this.nextIndex++;
            }
        },
        handlePrevious() {
            if (this.nextIndex > 0) {
                this.nextIndex--;
            }
        },
        toggleListDisplayOption() {
            this.listDisplayList = !this.listDisplayList;
        }
    }
})