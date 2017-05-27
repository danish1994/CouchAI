const cp = require('child_process'),
    keys = Object.keys(require('../preprocess/backend-node/categories.json'))

for(i=0;i<keys.length;i++) 
    cp.execSync('cp -r \"../api/img/couch/' + keys[i] + '\" \"../preprocess/backend-node/couch/\"')