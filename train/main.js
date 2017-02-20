var bodyparser = require('body-parser')
    app = require('express')()

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
    extended: true
}))
app.get('/', (request, response) => {
    console.log('Home')
})
app.use('/train', require('./train'))

app.listen(9095, 'localhost', () => {
    console.log('Serving running')
})