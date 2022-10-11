const express = require('express')
const badge = require('./lib/badge.js')

const app = express()

app.get('/', (req, res) => {
    // serve index.html
    res.sendFile(__dirname + '/index.html')
})

app.get('/image/:namespace/:image', async (req, res) => {
    const { namespace, image } = req.params
    const data = await badge(namespace === '_' ? null : namespace, image)
    res.set('Content-Type', data.type)
    res.send(data.body)
})

app.get('/image/:image', async (req, res) => {
    const { image } = req.params
    const data = await badge(null, image)
    res.set('Content-Type', data.type)
    res.send(data.body)
})

app.listen(process.env.PORT || 3000)