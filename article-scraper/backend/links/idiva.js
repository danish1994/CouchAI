var casper = require('casper').create(),
    fs = require('fs'),
    res = [],
    cnt = 0

const uri = 'http://www.idiva.com/archive/section/1'

casper.start(uri)
    .then(function () {
        casper.repeat(7, function () {
            cnt++
            var add = uri
            if (cnt > 1)
                add = uri + '/' + cnt
            this.thenOpen(add)
                .then(function () {
                    links = casper.evaluate(function () {
                        nodes = document.querySelectorAll('ul#content_loader > li > figure > a')
                        urls = []
                        for (i = 0; i < nodes.length; i++)
                            urls.push(nodes[i].href)
                        return urls
                    })
                    for (i = 0; i < links.length; i++)
                        res.push(links[i])
                    this.echo('(' + cnt + ') -> ' + res.length, 'COMMENT')
                })
            if (cnt == 7) {
                this.echo('Finished -> ' + res.length, 'COMMENT')
                fs.write('links-idiva.json', JSON.stringify(res.slice(0, 100)), 'w')
            }
        })
    })

casper.run(function () {
    this.echo('Scraping!', 'INFO')
    this.exit()
})