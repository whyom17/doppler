const express = require('express')
const httpProxy = require('http-proxy')

const app = express()
const PORT = process.env.PORT || 8000
const AWS_REGION = process.env.AWS_REGION || 'us-east-1'
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET || 'your-s3-bucket'
const BASE_PATH = `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/__outputs`

const proxy = httpProxy.createProxy()

app.use((req, res) => {
    const hostname = req.hostname;
    const subdomain = hostname.split('.')[0];

    // Custom Domain - DB Query

    const resolvesTo = `${BASE_PATH}/${subdomain}`

    return proxy.web(req, res, { target: resolvesTo, changeOrigin: true })

})

proxy.on('proxyReq', (proxyReq, req, res) => {
    const url = req.url;
    if (url === '/')
        proxyReq.path += 'index.html'

})

app.listen(PORT, () => console.log(`Reverse Proxy Running..${PORT}`))