import pageHeader from './components/header.js';
import echarts from 'echarts';
import generateFormOptions from './form/generateFormOptions';
import './components/modal';

new Vue({
    el: '#app',
    components: {pageHeader},
    data: function() {
        return {
            link: null,
            label: null,
            log: [],
            count: 0,
            url: null,
            disabled: null,

            controlToggled: false,

            modalDelete: false,
            modalDisable: false,

            refreshLoading: false,

            chart: null,
        }
    },

    mounted() {
        const href = window.location.href;
        const linkURL = href.split('/').slice(-1)[0];

        this.loadGraph(linkURL);

        this.chart = echarts.init(this.$refs.chart);

        window.addEventListener('resize', () => myChart.resize())
    },

    methods: {
        refresh() {
            console.log('Refreshing graph');

            this.refreshLoading = true;

            this.loadGraph(this.url)
            .then(() => {
                // refresh is too quick
                setTimeout(() => { this.refreshLoading = false; }, 1000);
            })
        },
        loadGraph(linkURL) {
            return new Promise(resolve => {
                fetch(`/options/data/${linkURL}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Cache': 'no-cache'
                    },
                    credentials: 'include',
                })
                .then(response => response.json())
                .then(val => {
                    this.label = val.data.label;
                    this.link = val.data.link;
                    this.url = val.data.url;
                    this.disabled = val.data.disabled == 1 ? true : false;
    
                    // log is for the graph
                    this.log = val.log;
                    this.count = val.count;

                    this.renderGraph(this.log)
                    
                    resolve();
                })
            });

        },
        renderGraph(log) {
            const options = generateFormOptions(log);
            this.chart.setOption(options);
        },

        handleDelete() {
            this.modalDelete = true;
        },
        closeModalDelete() {
            this.modalDelete = false;
        },
        confirmDelete() {
            this.closeModalDelete()
            // delete, then redirect to /    
            fetch(`/link/${this.url}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Cache': 'no-cache'
                },
                credentials: 'include',
            })
            .then(response => {
                if (response.status === 200) {
                    console.log('Confirm delete')
                    window.location = '/';
                }
            })
            .catch(err => console.log('error', error))
        },

        handleDisable() {
            this.modalDisable = true;
        },
        closeModalDisable() {
            this.modalDisable = false;
        },
        confirmDisable() {
            this.closeModalDisable()

            // send request, then update       
            fetch(`/link/disable/${this.url}`, {
                method: 'PATCH',
                body: JSON.stringify({updateTo: !this.disabled}),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Cache': 'no-cache'
                },
                credentials: 'include',
            })
            .then(response => {
                if (response.status === 200) this.disabled = !this.disabled;
            })
            .catch(err => console.log('error', error))
        }
    }
    
})
