var casper = require('casper').create(),
    fs = require('fs'),
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
                    .then(function () {
                        pages = casper.evaluate(function () {
                            return document.getElementById('pageCount').value
                        })
                        this.echo(this.getCurrentUrl())
                        casper.repeat(pages, function () {
                            obj = casper.evaluate(function () {
                                temp = []
                                list = document.querySelectorAll('div.product-img')
                                for (i = 0; i < list.length; i++)
                                    temp.push(list[i].href)
                                document.getElementById('nextPage').children[0].click()
                                return temp
                            })
                            data = data.concat(obj)
                        }).then(function () {
                            res.push({
                                name: entry.name,
                                links: data,
                                entries: data.length
                            })
                            this.echo((index + 1) + ' Type ' + entry.name + ' -> ' + res[res.length - 1].entries + ' (' + pages + ')', 'INFO')
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