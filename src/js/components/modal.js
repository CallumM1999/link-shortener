import modalBeforeEnter from '../animations/modalBeforeEnter';
import modalEnter from '../animations/modalEnter';
import modalLeave from '../animations/modalLeave';

Vue.component('modal', {
    props: {
        title: String,
        message: String, 
        closeModal: Function,
        show: Boolean,
    },
    template: `
        <transition v-on:beforeEnter='beforeEnter' v-on:enter='enter' v-on:leave='leave'>
            <div class='modal' @click='clickOut' v-if='show' ref='modal'>
                <div class='modalbody' ref='body'>
                    <h1 class='title'>{{title}}</h1>
           
                    <p class='message'>{{message}}</p>

                    <slot name='control'></slot>
                </div>
            </div>
        </transition>    
        `,
    methods: {
        clickOut(e) {
            return e.target.className === 'modal' ? this.$emit('closemodal') : false;
        },
        beforeEnter(el) {  modalBeforeEnter(this.$refs.body) },
        enter(el, done) { modalEnter(this.$refs.body, done) },
        leave(el, done) { modalLeave(this.$refs.body, done) }

    }
})
