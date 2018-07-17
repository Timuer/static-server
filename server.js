const http = require('http')
const config = require('./config')
const path = require('path')
const fs = require('fs')

let server = http.createServer((req, res) => {
    const url = req.url
    const root = config.root
    const u = path.join(root, url)
    console.info('req.url', url)
    if (!fs.existsSync(u)) {
        res.statusCode = 404
        res.setHeader('content-type', 'text/plain')
        res.end('File not found')
        return
    }
    fs.stat(u, (err, status) => {
        if (err) throw err
        if (status.isFile()) {
            let rs = fs.createReadStream(u)
            rs.pipe(res)
        } else if (status.isDirectory()) {
            fs.readdir(u, (err, files) => {
                if (err) throw err
                let lst = files.join(', ')
                res.end(lst)
            })    
        }

    })
})

server.listen(config.port, config.host, 1, () => {
    const u = 'http://' + config.host + ': ' + config.port
    console.info('server started at' + u)
})