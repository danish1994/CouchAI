const bash = require('child_process').spawn('bash'),
    cmd = [process.argv[2] + '/main.js', process.argv[3], process.argv[4]]

bash.stdout.pipe(process.stdout)
bash.stderr.pipe(process.stderr)

bash.stdin.write('node ' + cmd.join(' ') + '\n')
bash.stdin.end()