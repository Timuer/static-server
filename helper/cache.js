const {expires, cacheControl, maxAge, lastModified, etag} = require('../config').cache

module.exports.isFresh = function(req, res, status) {
    let result = false
    if (expires) {
        res.setHeader('Expires', new Date(Date.now() + maxAge * 1000).toUTCString())
    }
    if (cacheControl) {
        res.setHeader('Cache-Control', `public max-age=${maxAge}`)
    }
    if (lastModified) {
        let lm = status.mtime.toUTCString()
        res.setHeader('Last-Modified', lm)
        let t = req.headers['if-modified-since']
        if (t && t == lm) {
            result = true
        }
    }
    if (etag) {
        let etag = status.mtimeMs - status.size
        res.setHeader('Etag', etag)
        let t = req.headers['if-none-match']
        if (t && t == etag) {
            result = true
        }
    }
    return result
}