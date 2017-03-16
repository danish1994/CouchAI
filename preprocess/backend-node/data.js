const mongoose = require('mongoose'),
    router = require('express').Router()

mongoose.connect('mongodb://localhost/test')
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('Connected')
    var clothSchema = mongoose.Schema({
        name: 'String',
        extension: 'String',
        data: 'Object'
    }),
        cloth = mongoose.model('cloth', clothSchema)
    router.get('/', (request, response) => {
        response.send({
            data: 'OK'
        })
    })
})

module.exports = router