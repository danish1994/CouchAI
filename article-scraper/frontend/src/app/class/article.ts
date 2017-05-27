export class Article {
    category: String
    desc: String
    id: String
    image: String
    title: String
    url: String
    constructor(category:String, desc:String, id:String, image:String, title:String, url:String) {
        this.category = category
        this.desc = desc
        this.id = id
        this.image = image
        this.title = title
        this.url = url
    }
}