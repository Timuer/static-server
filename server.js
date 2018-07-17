const http = require('http')
const config = require('./config')
const path = require('path')
const {processPath} = require('./helper')


let server = http.createServer((req, res) => {
    const url = req.url
    const root = config.root
    const p = path.join(root, url)
    processPath(req, res, p)
})

server.listen(config.port, config.host, 1, () => {
    const u = 'http://' + config.host + ': ' + config.port
    console.info('server started at' + u)
})