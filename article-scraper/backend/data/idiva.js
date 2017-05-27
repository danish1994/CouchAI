var casper = require('casper').create(),
    res = [],
    args = casper.cli.args

const uri = args[0]
len = links.length,
    fs = require('fs')

casper.start(uri)
    .then(function () {
        data = casper.evaluate(function (uri) {
            node = document.querySelector('div.big-image')
            nav = document.querySelector('div.navs').children
            id = uri.substring(uri.lastIndexOf('/') + 1)
            return {
                category: nav[nav.length - 1].innerText,
                desc: document.querySelector('div#content_description_loader_' + id + '> p').innerText,
                id: id,
                image: node.children[3].src,
                title: node.children[1].children[0].innerText,
                url: uri
            }
        }, uri)
        if (data) {
            res.push(data)
            fs.write('data-idiva.json', JSON.stringify(res), 'w')
        }
    })

casper.run(function () {
    this.echo('Scraping!', 'INFO')
    this.exit()
})