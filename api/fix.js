const fs = require('fs-extra'),
    dir_path = './img/final',
    final_path = './img/final-opt'

dirs = fs.readdir(dir_path, (error, dirs) => {
    if(error)
        throw error
    dirs.map((dir, index) => {
        temp = fs.readdirSync(dir_path + '/' + dir).length
        if(temp > 20) {
            fs.copySync(dir_path + '/' + dir, final_path + '/' + dir)
            console.log('Copied ' + dir, index)
        }
    })
})