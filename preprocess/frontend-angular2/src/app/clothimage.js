"use strict";
var ClothImage = (function () {
    function ClothImage(name, data) {
        if (Object.keys(data).length == 0) {
            var temp = name.split('-'), tmp = temp.slice(1).join('-').split('.');
            this.name = temp[0];
            this.metaname = tmp[0];
            this.extension = tmp.slice(1).join('.');
            this.filename = this.name + '-' + this.metaname + '.' + this.extension;
            this.data = data;
            this.bounds = {};
        }
        else {
            this.name = name;
            this.data = data;
            this.bounds = {};
        }
    }
    return ClothImage;
}());
exports.ClothImage = ClothImage;
//# sourceMappingURL=clothimage.js.map