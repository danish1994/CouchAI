const mongoose = require('mongoose'),
    fs = require('fs'),
    router = require('express').Router()

mongoose.connect('mongodb://localhost:27017/test')
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('Connected')
    var clothSchema = mongoose.Schema({
            name: 'String',
            extension: 'String',
            data: 'Object',
            bounds: 'Object'
        }, {
            collection: 'clothes'
        }),
        cloth = mongoose.model('clothes', clothSchema)
    
    try {
        fs.statSync('./final')
    } catch(error) {
        fs.mkdirSync('./final')
    }

    router.get('/:name', (request, response) => {
        cloth.findOne({
            name: request.params.name
        }).exec((error, res) => {
            if (res) {
                try {
                img = fs.readFileSync('./final/' + res.name).toString('base64')
                } catch(error) {
                    img = null
                }
                response.send({
                    data: {
                        name: res.name,
                        data: res.data,
                        imgData: img
                    }
                })
            } else
                response.send({
                    data: null
                })
        })
    })

    router.post('/', (request, response) => {
        body = request.body
        cloth.findOne({
            name: body.name
        }).exec((error, res) => {
            console.log(res)
            if (res) {
                res.data = JSON.parse(body.data)
                res.bounds = JSON.parse(body.bounds)
                res.save()
                response.send({
                    data: 'Updated'
                })
            } else
                obj = new cloth({
                    name: body.name,
                    data: JSON.parse(body.data),
                    bounds: JSON.parse(body.bounds) || {}
                }).save((error, res, num) => {
                    if (error)
                        response.send({
                            data: 'Error'
                        })
                    else
                        response.send({
                            data: res + ', ' + num
                        })
                })
        })
    })
})

module.exports = router