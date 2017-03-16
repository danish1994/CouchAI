export class ClothImage {
    name: String
    metaname: String
    extension: String
    filename: String
    data: Object
    constructor(name: String) {
        let temp = name.split('-'),
            tmp = temp.slice(1).join('-').split('.')
        this.name = temp[0]
        this.metaname = tmp[0]
        this.extension = tmp.slice(1).join('.')
        this.filename = this.name + '-' + this.metaname + '.' + this.extension
    }
}