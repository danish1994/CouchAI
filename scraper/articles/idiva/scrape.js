var casper = require('casper').create(),
    fs = require('fs'),
    res = [],
    total = 0,
    current = 0

const uri = 'http://www.idiva.com/style-beauty',
    filename = uri.substring(uri.lastIndexOf('/') + 1) + '.json'

fs.changeWorkingDirectory(fs.absolute('./articles/idiva'))

casper.start(uri)
    .then(function () {
        this.echo(uri, 'COMMENT')
        urls = casper.evaluate(function () {
            temp = document.querySelectorAll('div.first_ul')
            obj = []
            type = ['trending', 'latest']
            for (i = 0; i < temp.length; i++) {
                tmp = temp[i].children[0].children
                uris = []
                for (j = 0; j < tmp.length; j++) {
                    temp_url = tmp[j].children[0].children[0].href
                    if (temp_url)
                        uris.push({
                            url: temp_url,
                            type: type[i]
                        })
                }
                obj.push(uris)
            }
            return obj
        })
        for(i=0;i<urls.length;i++)
            for(j=0;j<urls[i].length;j++)
                total++
        this.echo('Scraping ' + total + ' articles!')
        urls.forEach(function (url) {
            url.forEach(function (link) {
                casper.thenOpen(link.url).then(function () {
                    obj = casper.evaluate(function (link) {
                        info_str = 'div#content_description_loader_' + link.url.substring(link.url.lastIndexOf('/') + 1)
                        return {
                            author: document.querySelector('div.user').children[1].children[0].title,
                            category: document.querySelector('div.navs').lastElementChild.title,
                            image: document.querySelector('div.big-image').lastElementChild.src,
                            info: document.querySelector(info_str).children[0].innerText,
                            title: document.querySelector('div.big-image-caption').firstElementChild.innerText,
                            type: link.type,
                            url: link.url
                        }
                    }, link)
                    if(obj) {
                        this.echo(JSON.stringify(obj))
                        res.push(obj)
                    }
                    current++
                    this.echo(current + '/' + total, 'INFO')
                    if(current == total)
                        fs.write(filename, JSON.stringify(res), 'w')
                })
            })
        })
    })

casper.run(function () {
    this.echo('Scraping!', 'INFO')
    this.exit()
})