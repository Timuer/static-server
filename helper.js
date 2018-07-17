const fs = require('fs')
const {promisify} = require('util')
const ejs = require('ejs')
const {relative} = require('path')
const config = require('./config')

const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)

let str = fs.readFileSync('index.ejs', 'utf8')

module.exports.processPath = async function(req, res, path) {
    if (!fs.existsSync(path)) {
        res.statusCode = 404
        res.setHeader('content-type', 'text/plain')
        res.end('File or Directory not found')
        return
    }
    let status = await stat(path)
    try {
        if (status.isFile()) {
            res.statusCode = 200
            res.setHeader('content-type', 'text/plain')
            let rs = fs.createReadStream(path)
            rs.pipe(res)
        } else if (status.isDirectory()) {
            let files = await readdir(path)
            let result = ejs.render(str, {
                title: 'Static browser',
                base: relative(config.root, path),
                lst: files
            })
            res.statusCode = 200
            res.setHeader('content-type', 'text/html')
            res.write(result)
            res.end()
        }    
    } catch(ex) {
        res.statusCode = 500
        res.setHeader('content-type', 'text/plain')
        res.end('Server Internal Error')
        console.error(ex)
    }
}
