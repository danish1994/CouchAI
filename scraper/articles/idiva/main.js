const bash = require('child_process').spawn('bash'),
    dir_path = process.argv[1].substring(0, process.argv[1].lastIndexOf('/'))
    
bash.stdout.pipe(process.stdout)
bash.stderr.pipe(process.stderr)
bash.on('exit', (code) => {
    console.log('Process exited with code ' + code)
})

bash.stdin.write('casperjs ' + dir_path + '/scrape.js\n')
bash.stdin.end()