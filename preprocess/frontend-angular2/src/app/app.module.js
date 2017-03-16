"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var http_1 = require('@angular/http');
var forms_1 = require('@angular/forms');
var ng2_img_cropper_1 = require('ng2-img-cropper');
var clothimage_1 = require('./clothimage');
var app_service_1 = require('./app.service');
var AppComponent = (function () {
    function AppComponent(service) {
        var _this = this;
        this.service = service;
        this.img = [];
        this.img_data = {};
        this.counter = 0;
        this.data_fields = 0;
        this.arr = [];
        this.cropperSettings = new ng2_img_cropper_1.CropperSettings();
        this.cropperSettings.keepAspect = false;
        this.cropperSettings.noFileInput = true;
        this.cropperSettings.preserveSize = true;
        this.cropperSettings.fileType = 'jpeg';
        this.data = {};
        this.service.getImages().then(function (img) {
            var len = img.length;
            for (var i = 0; i < len; i++)
                _this.img.push(new clothimage_1.ClothImage(img[i]));
            _this.load_image();
        });
    }
    AppComponent.prototype.load_image = function () {
        var _this = this;
        var current_image = this.img[this.counter];
        this.service.getImageData(current_image.filename).then(function (img) {
            var img_ele = document.getElementById('img_name'), other_ele = document.getElementById('other');
            img_ele.value = current_image.name.toString();
            other_ele.value = current_image.metaname.toString();
            var image = new Image();
            image.src = 'data:image/jpeg;base64,' + img;
            _this.cropper.setImage(image);
        });
    };
    AppComponent.prototype.load = function (number) {
        var temp = this.counter + number;
        if (temp > this.img.length - 1)
            this.counter = 0;
        else if (temp < 0)
            this.counter = this.img.length - 1;
        else
            this.counter += number;
        console.log(this.counter);
        this.load_image();
    };
    AppComponent.prototype.add_field = function () {
        this.data_fields++;
        this.arr = Array(this.data_fields).fill(1).map(function (x, i) { return i + 1; });
        console.log('Adding', this.arr);
    };
    AppComponent.prototype.del_field = function () {
        this.data_fields--;
        this.arr = Array(this.data_fields).fill(1).map(function (x, i) { return i + 1; });
        console.log('Deleting', this.arr);
    };
    AppComponent.prototype.cropped = function (bounds) {
        this.cropperSettings.croppedHeight = bounds.bottom - bounds.top;
        this.cropperSettings.croppedWidth = bounds.right - bounds.left;
    };
    AppComponent.prototype.crop = function () {
        var image_data = document.getElementById('cropped_img').src, image_name = document.getElementById('img_name').value;
        image_data = image_data.substring(image_data.indexOf(',') + 1);
        console.log('Saving ', image_name, image_data.length);
        this.service.saveImage(image_name, image_data).then(function (obj) {
            console.log(obj);
        });
    };
    __decorate([
        core_1.ViewChild(ng2_img_cropper_1.ImageCropperComponent), 
        __metadata('design:type', ng2_img_cropper_1.ImageCropperComponent)
    ], AppComponent.prototype, "cropper", void 0);
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            template: "<div id=\"all\">\n              <img-cropper [image]=\"data\" [settings]=\"cropperSettings\" (onCrop)=\"cropped($event)\"></img-cropper><br>\n              <button (click)=\"crop()\">Crop</button>\n              <img *ngIf=\"data.image\" hidden id=\"cropped_img\" [src]=\"data.image\" [width]=\"cropperSettings.croppedWidth\" [height]=\"cropperSettings.croppedHeight\">\n              <div id=\"access\">\n                <button (click)=\"load(1)\">Next</button>\n                <button (click)=\"load(-1)\">Previous</button>\n                <input type=\"number\" [(ngModel)]=\"counter\" min=\"0\"/>\n                <button (click)=\"load(0)\">Go</button>\n              </div>\n              <div id=\"data\">\n                Name:<input type=\"text\" id=\"img_name\"/>\n                Other:<input type=\"text\" id=\"other\"/><br/>\n                <button (click)=\"add_field()\">Add Field</button>\n                <table>\n                  <thead *ngIf=\"data_fields != 0\">\n                    <th>Key</th>\n                    <th>Value</th>\n                    <th></th>\n                  </thead>\n                  <tbody id=\"fields\">\n                    <tr *ngFor=\"let i of arr\" id=\"data_{{i}}\">\n                      <td id=\"key_{{i}}\"><input type=\"text\"/></td>\n                      <td id=\"value_{{i}}\"><input type=\"text\"/></td>\n                      <td><button (click)=\"del_field()\">X</button></td>\n                    </tr>\n                  </tbody>\n                </table>\n                <button *ngIf=\"data_fields != 0\" (click)=\"save\">Save</button>\n              </div>\n            </div>"
        }), 
        __metadata('design:paramtypes', [app_service_1.Service])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, http_1.HttpModule, forms_1.FormsModule],
            declarations: [AppComponent, ng2_img_cropper_1.ImageCropperComponent],
            bootstrap: [AppComponent],
            providers: [app_service_1.Service]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map