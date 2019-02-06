module.exports = (req, res, next) => {
    console.log('authentication middleware');

    if (req.isAuthenticated()) return next();
    res.redirect('/login')
}