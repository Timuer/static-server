const {createGzip, createDeflate} = require('zlib')

module.exports = function(req, res, streamToCompress) {
    let ac = req.headers['accept-encoding']
    let zips = {
        gzip: () => streamToCompress.pipe(createGzip()),
        deflate: () => streamToCompress.pipe(createDeflate())
    }
    let keys = Object.keys(zips)
    for (let k of keys) {
        if (ac && ac.indexOf(k) !== -1) {
            res.setHeader('Content-Encoding', k)
            return zips[k]()
        }
    }
    return streamToCompress
}