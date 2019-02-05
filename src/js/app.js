require('../scss/main.scss');
require('./vue/vue.js');

console.log('ENVIRONMENT', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
    require('../../public/index.html')
}