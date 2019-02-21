export default (body, done) => {
    Velocity(body, {
        marginTop: '0px',
        opacity: 1,
        }, 200, 'ease-out').then(() => {
        done()
    })
}