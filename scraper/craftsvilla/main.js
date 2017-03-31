const async = require('async'),
    cp = require('child_process'),
    fs = require('fs'),
    args = [process.argv[2], process.argv[3]],
    names = ['initial', 'links', 'scrape'],
    code = [0, 1, 2],
    command = ['casperjs', '', '']

var bash = null

clean = () => {
    regex = /\.json$/
    files = fs.readdirSync('.').filter((filename) => {
        return filename.match(regex)
    })
    fs.rmdirSync('./data')
    files.map((filename) => {
        fs.unlinkSync(filename)
    })
    fs.mkdirSync('./data')
}

exec = (command, callback, arg) => {
    arg_str = arg[0] + ' ' + arg[1] + ' ' + arg[2]
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

clean()

async.eachSeries(names, (script, callback) => {
    command[1] = 'craftsvilla/' + script + '.js'
    command[2] = code[names.indexOf(script)]
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
            console.log(initial, part)
            exec(command, callback, [initial, part, iterator])
            initial += part
            iterator++
        })
    } else {
        console.log(command)
        exec(command, callback, [])
    }
})