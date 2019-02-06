export default Vue.component('listContainer', {
    props: ['list', 'loading'],
    template: `
        <ul class="table">
            <div v-if='!loading'>
                <li class="row title" >
                    <ul class="rowlist-title">
                        <li class="rowcol">Name</li>
                        <li class="rowcol">Alias</li>
                        <li class="rowcol">Link</li>
                        <li class="rowcol">Visits</li>
                        <li class="rowcol"></li>
                    </ul>
                </li>

                <li class="row" v-for='link in list'>
                    <ul class="rowlist">

                        <li class="rowcol label">{{ link.label }}</li>
                        <li class="rowcol link">{{ link.link }}</li>
            
                        <li class="rowcol icon">
                            <img :src='link.icon' class="icon">
                            <a :href='link.fullLink' class="fullLink">{{ link.fullLink }}</a>
                        </li>
                        <li class="rowcol visits">{{ link.visits }}</li>
                        <li class="rowcol options">
                            <button class="options">
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                        </li>
                    </ul>
                </li >
            </div>

            <!-- loading element -->
            <div class='loading' v-if='loading'>
                <h1>Loading</h1>

                <!-- source https://codepen.io/aurer/pen/jEGbA -->
                <svg class='loadingicon' version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                    <path class='loadingpath' fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
                        <animateTransform attributeType="xml"
                        attributeName="transform"
                        type="rotate"
                        from="0 25 25"
                        to="360 25 25"
                        dur="1.2s"
                        repeatCount="indefinite"/>
                    </path>
                </svg>
        

            </div>
        </ul >`,
})

