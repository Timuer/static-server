const fs = require('fs')
const {promisify} = require('util')
const ejs = require('ejs')
const config = require('../config')
const {relative} = require('path')
const mimetypes = require('./mimetypes')
const compress = require('./compress')

const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)

let str = fs.readFileSync('index.ejs', 'utf8')

let retFile = function(req, res, path) {
    res.statusCode = 200
    res.setHeader('content-type', mimetypes(path))
    let rs = fs.createReadStream(path)
    if (path.match(config.compress)[1]) {
        rs = compress(req, res, rs)
    }
    rs.pipe(res)
}

let retDirList = function(req, res, path, files) {
    let result = ejs.render(str, {
        title: 'Static browser',
        base: relative(config.root, path),
        lst: files
    })
    res.statusCode = 200
    res.setHeader('content-type', 'text/html')
    res.write(result)
}

let retError = function(req, res) {
    res.statusCode = 500
    res.setHeader('content-type', 'text/plain')
    res.end('Server Internal Error')
    console.error(ex)
}

module.exports = async function(req, res, path) {
    if (!fs.existsSync(path)) {
        res.statusCode = 404
        res.setHeader('content-type', 'text/plain')
        res.end('File or Directory not found')
        return
    }
    let status = await stat(path)
    try {
        if (status.isFile()) {
            retFile(req, res, path)
        } else if (status.isDirectory()) {
            let files = await readdir(path)
            retDirList(req, res, path, files)
        }    
    } catch(ex) {
        retError(req, res)
    }
}


