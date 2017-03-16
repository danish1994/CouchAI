const mongoose = require('mongoose'),
    router = require('express').Router()

mongoose.connect('mongodb://localhost:27017/test')
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('Connected')
    var clothSchema = mongoose.Schema({
        name: 'String',
        extension: 'String',
        data: 'Object'
    }, {
        collection: 'cloth'
    }),
        cloth = mongoose.model('cloth', clothSchema)
    router.get('/:name', (request, response) => {
        cloth.find({
            name: request.params.name
        }).exec((error, res) => {
            console.log(res)
            if(res.length)
                response.send({
                    data: res
                })
            else
                response.send({
                    data: null
                })
        })
    })

    router.post('/', (request, response) => {
        body = request.body
        obj = new cloth({
            name: body.name,
            data: JSON.parse(body.data)
        }).save((error, res, num) => {
            if(error)
                response.send({
                    data: 'Error'
                })
            else
                response.send({
                    data: res + ',' + num
                })
        })
    })
})

module.exports = router