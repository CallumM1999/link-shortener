export default Vue.component('page-header', {
    props: {
        auth: Boolean // display logout button
    },
    template: `
        <header class="header">
            <div class="container">
                <a href='/' class='title'>
                    <h1 class="title_text">Link Shortener</h1>
                </a>

                <a href='/logout' class='logout' v-if='auth'>
                    <h5 class='logout_text'>Logout</h5>
                </a>
            </div>
        </header>
    `
});