require('../scss/main.scss');

console.log('ENVIRONMENT', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
    require('../../public/index.html')
}