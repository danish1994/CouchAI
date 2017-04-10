const async = require('async'),
    cp = require('child_process'),
    fs = require('fs'),
    progress = require('progress'),
    args = [process.argv[2], process.argv[3]],
    clean_val = process.argv[4],
    names = ['initial', 'links', 'scrape'],
    code = [0, 1, 2],
    command = ['casperjs', '', ''],
    name = 'craftsvilla'

var bash = null,
    bar = null

clean = () => {
    regex = /\.json$/
    files = fs.readdirSync('./' + name).filter((filename) => {
        return filename.match(regex)
    })
    try {
        fs.rmdirSync('./' + name + '/data')
    } catch (error) {}
    files.map((filename) => {
        console.log('Removing file ' + filename)
        fs.unlinkSync('./' + name + '/' + filename)
    })
    fs.mkdirSync('./' + name + '/data')
}

check_clean = () => {
    links = fs.readdirSync('./' + name)
    data = fs.readdirSync('./' + name + '/data')

}

exec = (command, callback, arg) => {
    console.log(command, arg)
    arg_str = ''
    arg.map((val, index) => {
        arg_str += val
        if (index + 1 < arg.length)
            arg_str += ' '
    })
    bash = cp.spawn('bash')
    bash.stdout.pipe(process.stdout)
    bash.stderr.pipe(process.stderr)
    bash.on('exit', (code) => {
        msg = 'Finished with code ' + code
        if (arg.length > 0)
            console.log('[' + arg_str + ']' + msg)
        else
            console.log(msg)
        callback()
    })
    cmd = command.join(' ')
    temp = null
    if (arg.length > 0)
        cmd += ' ' + arg_str + '\n'
    bash.stdin.write(cmd)
    bash.stdin.end()
}

if (clean_val == 1) {
    console.log('Cleaning')
    clean()
    console.log('Done')
}

async.eachSeries(names, (script, callback) => {
    command[1] = name + '/' + script + '.js'
    command[2] = code[names.indexOf(script)]
    if (clean_val == 0 && script == 'initial')
        callback()
    else if (clean_val == 2 && script != 'scrape')
        callback()
    else {
        if (script == 'links') {
            len = require('./initial.json').length
            parts_arr = Array(Math.ceil(len / args[0])).fill().map((val, index) => {
                if ((index + 1) * args[0] > len)
                    return len
                else
                    return (index + 1) * args[0]
            })
            initial = 0
            iterator = 1
            async.eachSeries(parts_arr, (part, callback) => {
                exec(command, callback, [initial, part, iterator])
                initial = part
                iterator++
            })
        } else if (script == 'scrape') {
            regex = /^links.*\.json$/
            files_arr = Array(fs.readdirSync('./' + name).filter((filename) => {
                return filename.match(regex)
            }).length).fill().map((val, index) => index + 1)
            async.eachSeries(files_arr, (file, callback) => {
                data = require('./links-' + file + '.json')
                len = 0
                for (i = 0; i < data.length; i++)
                    len += data[i].links.length
                parts_arr = Array(Math.ceil(len / args[1])).fill().map((val, index) => {
                    if ((index + 1) * args[1] > len)
                        return len
                    else
                        return (index + 1) * args[1]
                })
                initial = 0
                regex = new RegExp('^data-' + file + '-\\d+\\.json$')
                list = fs.readdirSync('./' + name + '/data/').filter((filename) => {
                    return filename.match(regex)
                })
                bar = new progress('  Scraping [:bar] :percent :etas', {
                    complete: '=',
                    incomplete: ' ',
                    width: 100,
                    total: parts_arr.length
                })
                for(i=0;i<list.length;i++)
                    bar.tick()
                if (list.length == parts_arr.length)
                    callback()
                else {
                    console.log('Parts -> ' + file + ' <- ' + parts_arr)
                    parts_arr = parts_arr.slice(list.length)
                    initial = list.length
                    async.eachSeries(parts_arr, (part, callback) => {
                        exec(command, callback, [args[1], file, initial])
                        initial++
                        bar.tick()
                        if (initial == parts_arr.length)
                            callback()
                    })
                }
            })
        } else {
            exec(command, callback, [])
        }
    }
})