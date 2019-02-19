export default el => {
    Velocity(el, {translateX: '3px'}, 50)
    .then(() => Velocity(el, {translateX: '-3px'}, 50)
        .then(() => Velocity(el, {translateX: '0px'}, 50)))
}
