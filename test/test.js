var router = require('express').Router(),
    cp = require('child_process'),
    fs = require('fs'),
    async = require('async'),
    cosine_distance = require('compute-cosine-similarity'),
    euclidean_distance = require('compute-euclidean-distance')

router.post('/', (request, response) => {
    image_url = request.body.url
    filename = image_url.substring(image_url.lastIndexOf('/') + 1)
    image_path = '../data/' + filename
    try {
        cp.execFileSync('curl', ['--silent', '-o', image_path, '-L', image_url])
    } catch (error) {}
    model = JSON.parse(fs.readFileSync('../model/model.json'))
    log = '_test_log.txt'
    img = '_fingerprint.txt'
    console.log('Testing for ->', model.model_name)
    log_path = '../model/' + model.model_name + '/' + model.model_name
    test_log = log_path + log
    img_log = log_path + img
    bash = cp.spawn('bash')
    try {
        fs.unlinkSync(test_log)
        fs.unlinkSync(img_log)
    } catch (error) {
        if (error.code != 'ENOENT')
            console.log(error)
    }
    args = [
        '../tensorflow-master/bazel-bin/tensorflow/examples/label_image/label_image',
        '--graph=../' + model.model_const_options.output_graph,
        '--labels=../' + model.model_const_options.output_labels,
        '--output_layer=' + model.model_const_options.tensor_name,
        '--image=' + image_path
    ]
    bash.stdout.on('data', (data) => {
        fs.appendFileSync(img_log, data.toString())
    })
    bash.stderr.on('data', (data) => {
        console.log(data.toString())
        fs.appendFileSync(test_log, data.toString())
    })
    bash.on('exit', (code) => {
        console.log('Testing Complete -> ' + model.model_name)
        try {
            output_class = cp.execFileSync('grep', ['I tensorflow/examples/label_image/main.cc.*', '-o', test_log])
            output_class = output_class.toString().split('\n')[0]
            output_class = output_class.substring(output_class.indexOf(']') + 2, output_class.indexOf('(') - 1)
            console.log('Reading')
            model_path = '../model/' + model.model_name
            bottleneck_path = model_path + '/' + model.model_name + '_bottleneck/' + output_class
            files = fs.readdirSync(bottleneck_path)
            test_data = fs.readFileSync(model_path + '/' + model.model_name + '_fingerprint.txt', 'utf8')
            test_arr = test_data.split(' ').map(Number)
            totalFiles = files.length
            similarity = []
            console.log(output_class, model_path, bottleneck_path)
            for (i = 0; i < totalFiles; i++) {
                file_data = fs.readFileSync(bottleneck_path + '/' + files[i], 'utf8')
                file_arr = file_data.split(',').map(Number)
                similarity.push([cosine_distance(test_arr, file_arr), euclidean_distance(test_arr, file_arr), i])
            }
            similarity = similarity.filter((val) => {
                return val[0] >= 0.70
            }).sort((a, b) => {
                return a[1] - b[1]
            }).slice(0, 25).map((val) => {
                return files[val[2]].substring(0, files[val[2]].lastIndexOf('.'))
            })
            response.send(similarity)
        } catch (error) {}
    })
    bash.stdin.write(args.join(' ') + '\n')
    bash.stdin.end()
})

module.exports = router