export default (body, done) => {
    Velocity(body, {
        marginTop: '50px',
        opacity: 0,
        }, 200, 'ease-out').then(() => {
        done()
    })
}