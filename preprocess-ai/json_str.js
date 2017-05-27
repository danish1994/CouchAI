const index = require('./index.json')[0]['data']

var str = ''

for(i=0;i<index.length;i++) {
    str += index[i]['worksheetno'] + ';' + index[i]['sheetname']
    if(i+1 < index.length)
        str += '-'
}

require('fs').writeFileSync('./arg.txt', str, {
    encoding: 'utf8'
})