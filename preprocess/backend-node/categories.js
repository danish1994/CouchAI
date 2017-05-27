const json = require('./categories.json'),
    router = require('express').Router(),
    fs = require('fs'),
    dir_path = './couch'

router.get('/', (request, response) => {
    response.send({
        data: fs.readdirSync(dir_path)
    })
})

router.post('/', (request, response) => {
    response.send({
        data: json[request.body.category]
    })
})

router.post('/count', (request, response) => {
    category_path = dir_path + '/' + request.body.category
    files = 0
    try {
        fs.statSync(category_path)
        files = fs.readdirSync(category_path)
    } catch(error) {}
    response.send({
        count: files.length || files
    })
})

module.exports = router