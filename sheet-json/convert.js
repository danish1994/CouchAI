const fs = require('fs'),
    data = require('./data.json')

rows = Object.keys(data[0]).slice(1)

json = []
rows.map((row_name)=>{
    json[row_name] = {}
})

for(i=1;i<data.length;i++)
    for(j=0;j<rows.length;j++)
	if(data[i][rows[j]]) {
	    entry = data[i][rows[j]].split(',')
	    for(k=0;k<entry.length;k++)
		json[rows[j]][entry[k].trim()] = data[i]['couch']
	}

for(i=0;i<rows.length;i++)
    fs.writeFileSync('./json/' + rows[i] + '.json', JSON.stringify({
    	'category': json[rows[i]],
        'attributes': {}
    }))

