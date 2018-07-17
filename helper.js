const fs = require('fs')
const {promisify} = require('util')

const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)

module.exports.processPath = async function(req, res, path) {
    if (!fs.existsSync(u)) {
        res.statusCode = 404
        res.setHeader('content-type', 'text/plain')
        res.end('File or Directory not found')
        return
    }
    let status = await stat(url)
    try {
        if (status.isFile()) {
            res.statusCode = 200
            res.setHeader('content-type', 'text/plain')
            let rs = fs.createReadStream(u)
            rs.pipe(res)
        } else if (status.isDirectory()) {
            let files = await readdir(url)
            res.statusCode = 200
            res.setHeader('content-type', 'text/plain')
            res.end(files.join(','))
        }    
    } catch(ex) {
        res.statusCode = 500
        res.setHeader('content-type', 'text/plain')
        res.end('Server Internal Error')
    }
}
