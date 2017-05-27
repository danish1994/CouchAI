"use strict";
var Article = (function () {
    function Article(category, desc, id, image, title, url) {
        this.category = category;
        this.desc = desc;
        this.id = id;
        this.image = image;
        this.title = title;
        this.url = url;
    }
    return Article;
}());
exports.Article = Article;
//# sourceMappingURL=article.js.map