const {extname} = require('path')

module.exports = function(path) {
    let mime = {
        'jpg': 'image/jpeg',
        'html': 'text/html',
        'json': 'application/json',
        'txt': 'text/plain',
    }
    let ext = extname(path)
    .split('.')
    .pop()
    .toLowerCase()

    let result = null
    if (ext !== '') {
        result = mime[ext]
    }
    return result || mime['txt']
}