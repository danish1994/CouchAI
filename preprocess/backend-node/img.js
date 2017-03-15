const router = require('express').Router(),
    fs = require('fs')

router.get('/fs/:beg/:end', (request, response) => {
    params = request.params
    files = fs.readdirSync('./dresses').slice(params.beg, params.end)
    response.send({
        files: files
    })
})

router.post('/fs', (request, response) => {
    console.log(request.body)
    data = fs.readFileSync('./dresses/' + request.body.filename)
    response.send({
        data: data.toString('base64')
    })
})

router.post('/save', (request, response) => {
    body = request.body
    body.data = body.data.replace(/ /g, '+')
    console.log(body.data)
    fs.writeFile('./final/' + body.name + '.jpeg', body.data, {
        encoding: 'base64'
    }, (error) => {
        if(error)
            console.log(error)
        response.send({
            data: 'OK'
        })
    })
})

module.exports = router