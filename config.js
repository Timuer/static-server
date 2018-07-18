module.exports = {
    root: `${__dirname}`,
    port: 2000,
    host: 'localhost',
    compress: /.+\.(html|js|json|css|txt)$/,
    cache: {
        expires: true,
        cacheControl: true,
        maxAge: 500,
        lastModified: true,
        etag: true,
    }
}