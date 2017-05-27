const cp = require('child_process'),
    bash = cp.spawnSync('bash'),
    bash1 = cp.spawnSync('bash'),
    bash2 = cp.spawnSync('bash'),
    fs = require('fs')

process.stderr.pipe(bash.stderr)
process.stdout.pipe(bash.stdout)

bash.on('exit', (code) => {
    console.log('Sheet Updated')

    process.stderr.pipe(bash1.stderr)
    process.stdout.pipe(bash1.stdout)

    bash1.on('exit', (code) => {
        console.log('Arguments generated')
        data = fs.readFileSync('./arg.txt').toString()

        process.stderr.pipe(bash2.stderr)
        process.stdout.pipe(bash2.stdout)

        bash2.on('exit', (code) => {
            console.log('Categories Updated')
        })

        bash2.stdin.write('./categories.sh "' + data + '"')
        bash2.stdin.end()
    })

    bash1.stdin.write('node json_str.js\n')
    bash1.stdin.end()
})

bash.stdin.write('./update_sheet.sh\n')
bash.stdin.end()