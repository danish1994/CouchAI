"use strict";
var ClothImage = (function () {
    function ClothImage(name) {
        var temp = name.split('-'), tmp = temp.slice(1).join('-').split('.');
        this.name = temp[0];
        this.metaname = tmp[0];
        this.extension = tmp.slice(1).join('.');
        this.filename = this.name + '-' + this.metaname + '.' + this.extension;
    }
    ClothImage.prototype.set_data = function (data) {
        this.data = data;
    };
    ClothImage.prototype.get_data = function () {
        return this.data;
    };
    return ClothImage;
}());
exports.ClothImage = ClothImage;
//# sourceMappingURL=clothimage.js.map