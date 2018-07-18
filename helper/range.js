module.exports = function(totalSize, req, res) {
    let range = req.headers['range']
    if (!range) {
        return {code: 200}
    }
    log('has range')
    let groups = range.match(/bytes=(\d*)-(\d*)/)
    let start = groups[1] || 0
    let end = groups[2] || totalSize - 1
    res.setHeader('Accept-Ranges', 'bytes')
    res.setHeader('Content-Range', `bytes ${start}-${end}/${totalSize}`)
    res.setHeader('Content-Length', end - start)
    return {
        code: 206,
        start,
        end,
    }
}