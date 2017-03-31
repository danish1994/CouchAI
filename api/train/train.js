var router = require('express').Router(),
    cp = require('child_process'),
    fs = require('fs')

router.get('/', (request, response) => {
    try {
        data = JSON.parse(fs.readFileSync('../model/model.json'))
        response.send(data)
    } catch (error) {
        if (error != null && error.code == 'ENOENT')
            response.send({
                status: 1,
                message: 'No Model exists'
            })
    }
})

router.post('/', (request, response) => {
    bash = cp.spawn('bash')
    body = request.body
    name = body.name
    image_dir = 'img/' + name
    console.log(name)
    train_result = ''
    try {
        fs.statSync('../' + image_dir)
    } catch (error) {
        if (error != null && error.code == 'ENOENT') {
            response.send({
                status: 1,
                message: 'No such directory exists'
            })
            return
        }
    }
    model_dir = 'model'
    type_dir = model_dir + '/' + name + '/' + name
    bottleneck_path = type_dir + '_bottleneck'
    extra_opt = JSON.parse(JSON.stringify({
        train_steps: body.train_steps || 4000,
        learn_rate: body.learn_rate || 0.01,
        test_perc: body.test_per || 10,
        valid_perc: body.valid_per || 10,
        step_interval: body.step_interval || 10,
        train_bsize: body.train_bsize || 100,
        test_bsize: body.test_bsize || -1,
        valid_bsize: body.valid_bsize || 100
    }))
    opt = {
        model_dir: model_dir,
        image_dir: image_dir,
        output_graph: type_dir + '_output_graph.pb',
        output_labels: type_dir + '_output_labels.txt',
        summaries_dir: type_dir + '_retrain_logs',
        bottleneck_dir: bottleneck_path,
        tensor_name: name + '_result',
        train_log: type_dir + '_train_log.txt'
    }
    try {
        fs.unlinkSync('../' + opt.train_log)
    } catch (error) {
        if (error.code != 'ENOENT')
            console.log(error)
    }
    model_classes = fs.readdirSync('../' + image_dir).map((dir) => {
        console.log(dir)
        return {
            name: dir,
            files: fs.readdirSync('../' + image_dir + '/' + dir).length
        }
    })
    model_obj = {
        model_name: name,
        model_const_options: opt,
        model_var_options: extra_opt,
        model_classes: {
            unique_classes: model_classes.length,
            classes: model_classes
        }
    }
    args = [
        '../tensorflow-master/bazel-bin/tensorflow/examples/image_retraining/retrain',
        '--model_dir=../' + opt.model_dir,
        '--image_dir=../' + opt.image_dir,
        '--output_graph=../' + opt.output_graph,
        '--output_labels=../' + opt.output_labels,
        '--summaries_dir=../' + opt.summaries_dir,
        '--how_many_training_steps=' + extra_opt.train_steps,
        '--learning_rate=' + extra_opt.learn_rate,
        '--testing_percentage=' + extra_opt.test_perc,
        '--validation_percentage=' + extra_opt.valid_perc,
        '--eval_step_interval=' + extra_opt.step_interval,
        '--train_batch_size=' + extra_opt.train_bsize,
        '--test_batch_size=' + extra_opt.test_bsize,
        '--validation_batch_size=' + extra_opt.valid_bsize,
        '--bottleneck_dir=../' + opt.bottleneck_dir,
        '--final_tensor_name=' + opt.tensor_name
    ]
    bash.stdout.on('data', (data) => {
        str_data = data.toString()
        fs.appendFileSync('../' + opt.train_log, str_data)
        console.log(str_data)
    })
    bash.stderr.on('data', (data) => {
        console.log(data.toString())
    })
    bash.on('exit', (code) => {
        console.log('Training Complete')
        json_path = '../' + model_dir + '/model.json'
        model_log_data = cp.execFileSync('grep', ['Final test accuracy.*', '-o', '../' + opt.train_log]).toString()
        model_obj.train_result = model_log_data.substring(model_log_data.indexOf('=') + 2, model_log_data.indexOf('\n'))
        try {
            fs.writeFileSync(json_path, JSON.stringify(model_obj))
        } catch (error) {
            if (error != null && error.code == 'ENOENT')
                fs.writeFileSync(json_path, JSON.stringify(model_obj))
        }
    })
    bash.stdin.write(args.join(' ') + '\n')
    bash.stdin.end()
})

module.exports = router