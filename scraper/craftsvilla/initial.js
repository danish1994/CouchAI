var casper = require('casper').create(),
    fs = require('fs')

fs.changeWorkingDirectory(fs.absolute('./craftsvilla'))

const url = 'http://www.craftsvilla.com/'

casper.start(url)
    .then(function () {
        links = casper.evaluate(function () {
            categories = []
            types = []
            nodes = document.getElementById('mega-menu').children[0].children[0].children
            for (i = 1; i < 5; i++)
                categories.push(nodes[i])
            categories.forEach(function (category) {
                sub = category.children[1].children[0].children[0].children
                len = sub.length
                for (i = 0; i < len - 2; i++) {
                    child = sub[i].children[1].children
                    child_len = child.length
                    for (j = 0; j < child_len - 1; j++) {
                        node = child[j].children[0]
                        types.push({
                            name: node.text,
                            url: node.href
                        })
                    }
                }
            })
            return types
        })
        fs.write(fs.absolute('initial.json'), JSON.stringify(links), 'w')
    })

casper.run(function () {
    this.exit()
})