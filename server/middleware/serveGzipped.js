const fs = require('fs')

const serveGzipped = contentType => (req, res, next) => {
    // does browser support gzip? does the file exist?
    const acceptedEncodings = req.acceptsEncodings()
    if (
        acceptedEncodings.indexOf('gzip') === -1
        || !fs.existsSync(`./public/${req.url}.gz`)
    ) {
        next()
        return
    }

    // update request's url
    req.url = `${req.url}.gz`

    // set correct headers
    res.set('Content-Encoding', 'gzip')
    res.set('Content-Type', contentType)

    // let express.static take care of the updated request
    next()
}


module.exports = serveGzipped;