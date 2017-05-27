const router = require('express').Router(),
    async = require('async'),
    timestamps = require('mongoose-timestamps'),
    findorcreate = require('mongoose-findorcreate'),
    cp = require('child_process'),
    fs = require('fs')

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test')

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Database connection successful')
    var articleSchema = mongoose.Schema({
        name: String,
        url: String
    }, {
        collection: 'articles'
    })
    articleSchema.plugin(timestamps)
    articleSchema.plugin(findorcreate)
    article = mongoose.model('article', articleSchema)

    router.get('/', (request, response) => {
        response.send({
            status: 0,
            message: 'DB OK'
        })
    })

    router.post('/view/', (request, response) => {
        filename = request.body.filename
        start = request.body.start
        stop = request.body.stop
        data = require('./data-json/data-' + filename + '.json').slice(start, stop)
        response.send({
            data: data
        })
    })

    router.post('/url/', (request, response) => {
        uri = request.body.uri
        regex = /\/\/(?:www\.)?(\w+)/g
        console.log(uri)
        filename = uri.match(regex)[0].split('//')[1]
        if (filename.split('www.')[1])
            filename = filename.split('www.')[1]

        bash = cp.spawn('bash')

        bash.stdout.pipe(process.stdout)
        bash.stderr.pipe(process.stderr)

        bash.on('exit', (code) => {
            console.log('Completed with code ' + code)
            try {
                data = require('./data-json/data-' + filename + '.json')
                json_data = require('./data-' + filename + '.json')
                for (i = 0; i < json_data.length; i++)
                    data.push(json_data[i])
                fs.writeFileSync('./data-json/data-' + filename + '.json', JSON.stringify(data))
                fs.unlinkSync('./data-' + filename + '.json')
            } catch (error) {
                //fs.renameSync('./data-' + filename + '.json', './data-json/data-' + filename + '.json')
            }
            console.log({
                filename: filename
            })
            response.send({
                filename: filename
            })
        })

        bash.stdin.write('casperjs data/' + filename + '.js ' + uri + '\n')
        bash.stdin.end()
    })

    router.post('/links/', (request, response) => {
        filename = request.body.filename
        bash = cp.spawn('bash')

        bash.stdout.pipe(process.stdout)
        bash.stderr.pipe(process.stderr)

        bash.on('exit', (code) => {
            console.log('Completed with code ' + code)
            fs.renameSync('./links-' + filename + '.json', './links-json/links-' + filename + '.json')
            data = require('./links-json/links-' + filename + '.json')
            count = 0
            new_obj = []
            async.eachOfSeries(data, (uri, index, callback) => {
                article.findOrCreate({
                    name: filename,
                    url: uri
                }, (err, res, created) => {
                    if (created)
                        new_obj.push(uri)
                    if (index == data.length - 1) {
                        fs.writeFileSync('./links-json/links-' + filename + '.json', JSON.stringify(new_obj))
                        console.log({
                            count: new_obj.length
                        })
                        response.send({
                            count: new_obj.length
                        })
                    }
                    callback()
                })
            })
        })

        bash.stdin.write('casperjs links/' + filename + '.js\n')
        bash.stdin.end()
    })

    router.post('/data/', (request, response) => {
        filename = request.body.filename
        start = request.body.start
        stop = request.body.stop
        bash = cp.spawn('bash')

        bash.stdout.pipe(process.stdout)
        bash.stderr.pipe(process.stderr)

        bash.on('exit', (code) => {
            console.log('Completed with code ' + code)
            try {
                data = require('./data-json/data-' + filename + '.json')
                json_data = require('./data-' + filename + '.json')
                for (i = 0; i < json_data.length; i++)
                    data.push(json_data[i])
                fs.writeFileSync('./data-json/data-' + filename + '.json', JSON.stringify(data))
            } catch (error) {
                fs.renameSync('./data-' + filename + '.json', './data-json/data-' + filename + '.json')
            }
            console.log({
                length: require('./data-json/data-' + filename + '.json').length,
                start: start,
                stop: stop
            })
            response.send({
                length: require('./data-json/data-' + filename + '.json').length,
                start: start,
                stop: stop
            })
        })

        bash.stdin.write('casperjs data/' + filename + '.js ' + [start, stop].join(' ') + '\n')
        bash.stdin.end()
    })
})

module.exports = router