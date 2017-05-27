const gsjson = require('google-spreadsheet-to-json'),
    fs = require('fs'),
    worksheetNo = process.argv[2],
    sheetName = process.argv[3],
    filename = process.argv[4]

var sheets = [], data = []

try {
    fs.statSync('./' + filename)
    data = require('./' + filename)
    sheets = []
    for (i = 0; i < data.length; i++)
        sheets.push(parseInt(Number(data[i]['worksheetNo'])))
    sheets = sheets.filter((val) => {
        return val == worksheetNo
    })
} catch (error) {}
console.log(worksheetNo, sheetName, ',', filename)
if (sheets.length == 0)
    gsjson({
        spreadsheetId: '1HL0xbcANp4Ml5Ufx2Ke4C3eDLaQrQp1H1f59zz6VnKw',
        worksheet: worksheetNo
    }).then((res) => {
        data.push({
            worksheetNo: worksheetNo,
            sheetName: sheetName,
            data: res
        })
        fs.writeFileSync('./' + filename, JSON.stringify(data))
    })
    .catch((error) => console.log(error))