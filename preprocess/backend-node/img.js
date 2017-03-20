const router = require('express').Router(),
    fs = require('fs'),
    json = require('./flipkart-final.json')

router.get('/fs/dir', (request, response) => {
    fs.readdir('./flipkart', (error, dirs) => {
        if(error)
            response.send({
                data: 'Error'
            })
        else
            response.send({
                data: dirs
            })
    })
})

router.get('/fs/:dir/:beg/:end', (request, response) => {
    params = request.params
    files = fs.readdirSync('./' + params.dir).slice(Number(params.beg), Number(params.end))
    response.send({
        files: files
    })
})

router.post('/fs', (request, response) => {
    data = fs.readFileSync('./' + request.body.dirname + '/' + request.body.filename)
    id = request.body.filename.split('-')[0]
    for(i=0;i<json.length;i++)
        if(json[i]['id'] == id)
            break
    if(json[i])
        response.send({
            data: data.toString('base64') + '$' + json[i].url
        })
    else
        response.send({
            data: data.toString('base64')
        })
})

router.post('/save', (request, response) => {
    body = request.body
    body.data = body.data.replace(/ /g, '+')
    fs.writeFile('./final/' + body.name + '.jpg', body.data, {
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