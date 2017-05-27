var router = require('express').Router(),
    cp = require('child_process'),
    fs = require('fs'),
    async = require('async'),
    cosine_distance = require('compute-cosine-similarity'),
    euclidean_distance = require('compute-euclidean-distance')

cos_sim = (original, test) => {
    numerator = []
    normalized_original = 0.00
    normalized_test = 0.00
    for(i=0;i<original.length;i++) {
        numerator.push(original[i] * test[i])
        normalized_original += Math.pow(original[i], 2)
        normalized_test += Math.pow(test[i], 2)
    }
    console.log(numerator, normalized_original, normalized_test)
    denominator = Math.sqrt(normalized_original) * Math.sqrt(normalized_test)
    return 1 - (numerator/denominator)
}

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
        '--image=' + image_path,
        '--input_layer=Mul'
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
            output_tensor_values = cp.execFileSync('grep', ['\\[\\[\\[.*\\]\\]\\]', '-o', test_log]).toString() 
            output_tensor_values = output_tensor_values.slice(3, output_tensor_values.length-3)
            console.log(output_tensor_values)
            test_arr = output_tensor_values.split(' ').map(Number)
            console.log(test_arr.length)
            output_class = cp.execFileSync('grep', ['I tensorflow/examples/label_image/main.cc.*', '-o', test_log])
            output_class = output_class.toString().split('\n')[0]
            output_class = output_class.substring(output_class.indexOf(']') + 2, output_class.indexOf('(') - 1)
            output_class = output_class.split(' ')
            for(i=0;i<output_class.length;i++) {
                try {
                    output_class[i] = output_class[i].charAt(0).toUpperCase() + output_class[i].slice(1)
                } catch(error) {}
            }
            output_class = output_class.join(' ')
            console.log('Reading')
            model_path = '../model/' + model.model_name
            bottleneck_path = model_path + '/' + model.model_name + '_bottleneck/' + output_class
            files = fs.readdirSync(bottleneck_path)
            totalFiles = files.length
            console.log(totalFiles)
            similarity = []
            console.log(output_class, model_path, bottleneck_path)
            for (i = 0; i < 1; i++) {
                file_data = fs.readFileSync(bottleneck_path + '/' + files[i], 'utf8')
                file_arr = file_data.split(',').map(Number)
                console.log(cos_sim(test_arr, file_arr))
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