var casper = require('casper').create(),
    fs = require('fs'),
    res = [],
    total = 0,
    current = 0

const uri = 'http://www.femina.in/fashion/trends',
    filename = uri.substring(uri.lastIndexOf('/') + 1) + '.json'

fs.changeWorkingDirectory(fs.absolute('./articles/femina'))

casper.start(uri)
    .then(function () {
        this.echo(uri, 'COMMENT')
        urls = casper.evaluate(function () {
            uris = []
            list = document.querySelectorAll('div#subsection-data > div.row')
            for (i = 0; i < list.length; i++) {
                if (list[i].children) {
                    for (j = 0; j < list[i].children.length; j++) {
                        uris.push({
                            url: list[i].children[j].children[0].children[1].children[0].children[0].href
                        })
                    }
                }
            }
            return uris
        })
        for (i = 0; i < urls.length; i++)
            total++
            this.echo('Scraping ' + total + ' articles')
        urls.forEach(function (link) {
            casper.thenOpen(link.url)
                .then(function () {
                    obj = casper.evaluate(function (link_uri) {
                        data = document.querySelectorAll('div.article_container')[1].children[0]
                        article_id = link_uri.substring(link_uri.lastIndexOf('-') + 1, link_uri.lastIndexOf('.'))
                        str = article_id + '-1'
                        return JSON.parse(JSON.stringify({
                            title: data.children[1].innerText,
                            author: data.children[2].children[0].children[0].children[0].title,
                            video: data.children[3].children[0].children[0].children[0].children[0].src,
                            image: document.getElementById('39070-1').getAttribute('data-image'),
                            info: data.children[3].children[0].children[0].children[0].children[1].innerText || document.querySelector(str).innerText,
                            url: link_uri,
                            category: 'Fashion'
                        }))
                    }, link.url)
                    if (obj) {
                        this.echo(JSON.stringify(obj))
                        res.push(obj)
                    }
                    current++
                    this.echo(current + '/' + total, 'INFO')
                    if (current == total)
                        fs.write(filename, JSON.stringify(res), 'w')
                })
        })
    })

casper.run(function () {
    this.echo('Scraping', 'INFO')
    this.exit()
})