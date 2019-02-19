export default (el, done) => {
    Velocity(el, {opacity: '1'}, 300).then(() => done());
}