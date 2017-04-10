var casper = require('casper').create(),
    fs = require('fs'),
    current_length = 0,
    data_length = []

fs.changeWorkingDirectory(fs.absolute('./craftsvilla'))

const arg = casper.cli.args,
    filename = 'links-' + arg[2] + '.json',
    save_filename = 'data-' + arg[2] + '-' + arg[3] + '.json',
    total_length = parseInt(arg[1]),
    url = 'http://www.craftsvilla.com/',
    all_data = JSON.parse(fs.read(filename))

fs.changeWorkingDirectory(fs.absolute('./data'))

function range(len, data, resume) {
    i = 0
    for(i;i<data.length;i++)
        if(len < data[i].links.length) {
            if(resume == 1)
                data[i].links = data[i].links.slice(len)
            else
                data[i].links = data[i].links.slice(0, len)
            break
        }
    return data.slice(i, i+1)
}

if(fs.exists(save_filename)) {
    data_length = JSON.parse(fs.read(save_filename)).length
    current_length = data_length
    data = range(total_length, all_data, 0)
    data = range(data_length, data, 1)
}
else {
    data = range(total_length, all_data, 0)
}

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
                    this.echo('->' + (current_length + 1) + '/' + total_length, 'INFO')
                    res = []
                    if(fs.exists(save_filename))
                        res = JSON.parse(fs.read(save_filename))
                    res.push(obj)
                    fs.write(save_filename, JSON.stringify(res), 'w')
                    current_length++
                })
            })
        })
    })

casper.run(function () {
    this.exit()
})