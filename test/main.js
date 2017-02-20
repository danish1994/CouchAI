var bodyparser = require('body-parser'),
    app = require('express')()

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
    extended: true
}))
app.get('/', (request, response) => {
    console.log('Home')
})
app.use('/test', require('./test'))

app.listen(9099, 'localhost', () => {
    console.log('Serving running')
})