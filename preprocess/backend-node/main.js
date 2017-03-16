const express = require('express'),
    app = express(),
    bodyparser = require('body-parser'),
    path = require('path'),
    ip = 'localhost',
    port = 8089

app.use('/', bodyparser.json({
    limit: '50mb'
}))
app.use('/', bodyparser.urlencoded({
    extended: true,
    limit: '50mb'
}))

app.use('/img', require('./img'))
app.use('/data', require('./data'))
app.use('/dresses', express.static(path.join(__dirname, './dresses')))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.listen(port, ip, () => {
    console.log('Server on ' + port)
})