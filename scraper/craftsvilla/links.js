var casper = require('casper').create(),
    fs = require('fs'),
    utils = require('utils'),
    res = [],
    links = null,
    link = null

fs.changeWorkingDirectory(fs.absolute('./craftsvilla'))

const arg = casper.cli.args,
    filename = 'links-' + arg[3] + '.json',
    initial = JSON.parse(fs.read('initial.json')).slice(arg[1], arg[2]),
    uri = 'http://www.craftsvilla.com/'

if (fs.exists(filename)) {
    links = JSON.parse(fs.read(filename))
    link = links.map(function (val) {
        return val.name
    })
    res = links
}

function find_link(str) {
    if (link == null)
        return 1
    len = link.length
    for (i = 0; i < len; i++)
        if (str == link[i])
            return 0
    return 1
}

casper.start()
    .then(function () {
        initial.forEach(function (entry, index) {
            var data = [],
                url = ''
            if (find_link(entry.name)) {
                casper.thenOpen(entry.url)
                    .wait(5000)
                    .then(function () {
                        pages = casper.evaluate(function () {
                            return document.getElementById('pageCount').value
                        })
                        casper.repeat(pages, function () {
                            obj = casper.evaluate(function () {
                                temp = []
                                list = document.querySelectorAll('div.product-img')
                                for (i = 0; i < list.length; i++)
                                    temp.push(list[i].children[0].href)
                                pages = document.querySelectorAll('li#pager')
                                arr = []
                                for(i=0;i<pager.length;i++)
                                    arr.push(pages[i].classList.length)
                                index = arr.indexOf(1)
                                pages[index+1].children[0].click()
                                return temp
                            })
                            obj = utils.unique(obj)
                            data = data.concat(obj)
                        }).then(function () {
                            res.push({
                                name: entry.name,
                                links: data,
                                entries: data.length
                            })
                            this.echo((index + 1) + ' ' + entry.name + ' -> ' + res[res.length - 1].entries + ' (' + pages + ')', 'INFO')
                            mode = 'a'
                            if (link == null)
                                mode = 'w'
                            fs.write(filename, JSON.stringify(res), mode)
                        })
                    })
            }
        })
    })


casper.run(function () {
    this.exit()
})