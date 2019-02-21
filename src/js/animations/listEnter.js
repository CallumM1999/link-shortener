export default (el, done) => {
    const delay = el.dataset.index * 100;

    setTimeout(() => {
        Velocity(el,  {opacity: 1, height: '60px' }).then(() => done())
    }, delay);
}