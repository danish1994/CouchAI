const gsjson = require('google-spreadsheet-to-json'),
    fs = require('fs')

gsjson({
spreadsheetId: '1q2c3VMn9TKBF0O1LHO9CnJ7jWdyDCL2U5QJL3E90F38', worksheet: ['Updated Category Mapping']}).then((result) => fs.writeFileSync('./data.json', JSON.stringify(result[0]))).catch((err)=>console.log(err))

