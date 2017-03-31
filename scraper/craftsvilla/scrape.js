var casper = require('casper').create(),
    fs = require('fs'),
    res = []

fs.changeWorkingDirectory(fs.absolute('./craftsvilla'))

const url = 'http://www.craftsvilla.com/',
    data = JSON.parse(fs.read('links-1.json')).slice(4, 7)

fs.changeWorkingDirectory(fs.absolute('./data'))

casper.start(url)
    .then(function () {
        data.forEach(function (entry, entry_index) {
            entry.links.forEach(function (link, link_index) {
                casper.thenOpen(link).then(function () {
                    obj = casper.evaluate(function (link, name) {
                        res = {}
                        details = document.querySelectorAll('ul.psd-list')
                        for (i = 0; i < details.length; i++) {
                            tmp = details[i].children
                            for (j = 0; j < tmp.length; j++) {
                                p = tmp[j].innerHTML
                                p = p.substring(p.indexOf('>') + 1).split('</span> : ')
                                res[p[0]] = p[1]
                            }
                        }
                        org_price = document.querySelectorAll('span.pdp-original-price')[0].innerText
                        dis_price = document.querySelectorAll('span.pdp-offer-price')[0].innerText
                        size = ''
                        main = document.querySelectorAll('ul.pdp-delivery-variant')[0].children[1].children
                        for (i = 0; i < main.length - 1; i++) {
                            if (i > 0)
                                size += ' '
                            size += main[i].children[0].children[0].innerText
                        }
                        return {
                            brand: document.getElementsByClassName('vender-name')[0].innerHTML,
                            category: name,
                            details: res,
                            discount: document.querySelectorAll('span.pdp-discount')[0].innerText.split(' ')[0],
                            discount_price: dis_price.split(' ')[1],
                            id: link.substring(link.lastIndexOf('/') + 1),
                            image: document.getElementById('big1').children[0].src,
                            name: document.getElementsByTagName('h1')[0].innerText,
                            orginal_price: org_price.split(' ')[1],
                            size: size,
                            url: link
                        }
                    }, link, entry.name)
                    this.echo('->' + (link_index + 1) + '/' + entry.links.length, 'INFO')
                    res.push(obj)
                    if (res.length == entry.links.length)
                        fs.write(entry.name + '.json', JSON.stringify(res), 'w')
                })
            })
        })
    })

casper.run(function () {
    this.exit()
})