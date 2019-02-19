export default (el, done) => {
    Velocity(el, {opacity: '0'}, 300).then(() => done());
}