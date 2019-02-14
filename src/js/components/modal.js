Vue.component('modal', {
    data: function() {
        return {

        }
    },
    props: {
        title: String,
        message: String, 
        closeModal: Function,
    },
    template: `<div class='modal' @click='clickOut'>
        <div class='modalbody'>
            <h1 class='title'>{{title}}</h1>
           
            <p class='message'>{{message}}</p>

            <slot name='control'></slot>
        </div>
    </div>`,
    methods: {
        clickOut(e) {
            if (e.target.className === 'modal') {
                this.$emit('closemodal')
            }
        }
    }
})
