const cp = require('child_process')

try {
    cp.execSync('./update_sheet.sh')
    console.log('Sheet Updated')
    cp.execSync('node json_str.js')
    console.log('Argument string generated')
    file = require('fs').readFileSync('./arg.txt').toString()
    cp.execSync('./categories.sh \"' + file + '\"')
    console.log('Categories generated')
} catch(error) {}