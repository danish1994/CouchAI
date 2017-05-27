const express = require('express'),
    bodyparser = require('body-parser'),
    app = express(),
    ip = 'localhost',
    port = 9999

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
    extended: true
}))

app.get('/', (request, response) => {
    response.send({
        status: 0,
        message: 'OK'
    })
})

app.use('/db/', require('./data.js'))

app.listen(port, ip, () => {
    console.log('Server running on port ' + port)
})