const router = require('express').Router(),
    fs = require('fs'),
    json_path = './couch.json',
    img_dir = './couch'
json = require(json_path)

router.get('/fs/dir', (request, response) => {
    fs.readdir(img_dir, (error, dirs) => {
        if (error)
            response.send({
                data: 'Error'
            })
        else {
            response.send({
                data: dirs
            })
            console.log(dirs)
        }
    })
})

router.get('/fs/:dir/:beg/:end', (request, response) => {
    params = request.params
    files = fs.readdirSync(img_dir + '/' + params.dir).slice(Number(params.beg), Number(params.end))
    console.log(files)
    response.send({
        files: files
    })
})

router.post('/fs', (request, response) => {
    data = fs.readFileSync(img_dir + '/' + request.body.dirname + '/' + request.body.filename)
    id = request.body.filename.split('-')[0]
    for (i = 0; i < json.length; i++)
        if (json[i]['id'] == id)
            break
    if (json[i])
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
    names = body.name.split('/')
    try {
        fs.statSync('./final/' + names[0])
    } catch(error) {
        fs.mkdirSync('./final/' + names[0])
    }
    fs.writeFile('./final/' + body.name, body.data, {
        encoding: 'base64'
    }, (error) => {
        if (error)
            console.log(error)
        response.send({
            data: 'OK'
        })
    })
})

module.exports = router