const fs = require('fs'),
    data = require('./categories.json')

var json = {}

for (i = 0; i < data.length; i++) {
    keys = Object.keys(data[i].data[0]).map((val) => {
        return val.charAt(0).toUpperCase() + val.slice(1)
    })
    json[data[i]['sheetName']] = {}
    for (j = 0; j < keys.length; j++)
        json[data[i]['sheetName']][keys[j]] = []
    for (j = 0; j < data[i].data.length; j++) {
        ky = Object.keys(data[i].data[j])
        fky = ky.map((val) => {
            return val.charAt(0).toUpperCase() + val.slice(1)
        })
        for (k = 0; k < ky.length; k++)
            json[data[i]['sheetName']][fky[k]].push(data[i].data[j][ky[k]])
    }
}

fs.writeFileSync('../preprocess/backend-node/categories.json', JSON.stringify(json))