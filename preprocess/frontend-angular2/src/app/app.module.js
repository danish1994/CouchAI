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
var ngx_bootstrap_1 = require('ngx-bootstrap');
var clothimage_1 = require('./clothimage');
var app_service_1 = require('./app.service');
var AppComponent = (function () {
    function AppComponent(service) {
        var _this = this;
        this.service = service;
        this.img = [];
        this.img_data = {};
        this.counter = 0;
        this.min_counter = 0;
        this.max_counter = 0;
        this.img_number = 0;
        this.batch = 0;
        this.batch_size = 20;
        this.data_fields = 0;
        this.saved = 'Checking...';
        this.img_load = false;
        this.keys = [];
        this.values = Array(this.keys.length).fill([]);
        /*this.cropperSettings = new CropperSettings()
        this.cropperSettings.keepAspect = false
        this.cropperSettings.noFileInput = true
        this.cropperSettings.preserveSize = true
        this.cropperSettings.fileType = 'jpeg'
        this.data = {}*/
        this.service.getDirs().then(function (dirs) {
            _this.dirs = dirs;
        });
        /*this.service.getDirs().then((dirs) => {
          this.dirs = dirs
          console.log(this.dirs)
        })*/
    }
    AppComponent.prototype.ngDoCheck = function () {
        var data = this.img[this.counter - this.batch * this.batch_size];
        try {
            if (data.data != undefined && Object.keys(data.data).length != 0) {
                for (var i = 0; i < this.keys.length; i++) {
                    if (data.data[this.keys[i].toString()] == '')
                        document.getElementById('button_' + this.keys[i]).innerText = 'Select ' + this.keys[i].toString();
                    else
                        document.getElementById('button_' + this.keys[i]).innerText = data.data[this.keys[i].toString()].toString();
                }
                this.saved = 'Loaded';
            }
        }
        catch (error) { }
    };
    AppComponent.prototype.clear = function () {
        for (var i = 0; i < this.keys.length; i++)
            document.getElementById('button_' + this.keys[i]).innerText = 'Select ' + this.keys[i].toString();
    };
    AppComponent.prototype.updateDir = function (event) {
        var _this = this;
        var e = event || window.event;
        var target = e.target || e.srcElement;
        this.dir = target.id;
        this.batch = 0;
        this.counter = 0;
        document.getElementById('category').innerText = target.id;
        this.service.getCategories(this.dir).then(function (categories) {
            _this.keys = Object.keys(categories);
            _this.values = categories;
            console.log(_this.keys, _this.values);
            _this.service.getCategoryCount(_this.dir).then(function (count) {
                _this.max_counter = Number(count);
                _this.load_batch();
            });
        });
    };
    AppComponent.prototype.updateVal = function (event) {
        var e = event || window.event;
        var target = e.target || e.srcElement;
        var temp = target.id.split('_');
        document.getElementById('button_' + temp[0]).innerText = temp[1];
    };
    AppComponent.prototype.load_image = function () {
        var _this = this;
        var current_image = this.img[this.counter - this.batch * this.batch_size];
        for (var i = 0; i < this.keys.length; i++)
            document.getElementById('button_' + this.keys[i]).innerText = 'Select ' + this.keys[i].toString();
        this.service.getImageData(this.dir, current_image.filename).then(function (img) {
            var img_ele = document.getElementById('img_name');
            img_ele.value = current_image.name.toString();
            var image = new Image();
            image.src = 'data:image/jpeg;base64,';
            var image_base_ele = document.getElementById('product_image');
            image_base_ele.src = 'data:image/jpeg;base64,' + img;
            var temp = img.split('$');
            img = temp[0];
            _this.url = temp[1];
            _this.service.check(current_image.name.toString()).then(function (res) {
                var data = JSON.parse(res.toString());
                if (data) {
                    _this.saved = 'Loading Data...';
                    _this.current_keys = Object.keys(data.data);
                    _this.data_fields = _this.current_keys.length;
                    current_image.data = data.data;
                    if (data.imgData != null)
                        image.src += data.imgData;
                    else
                        image.src += img;
                }
                else {
                    _this.saved = 'No Data';
                    image.src += img;
                }
                //this.cropper.setImage(image)
                _this.img_load = true;
            });
        });
    };
    AppComponent.prototype.load_batch = function () {
        var _this = this;
        this.img = [];
        this.saved = 'Checking...';
        var min = this.batch * this.batch_size, max = min + this.batch_size;
        this.service.getImages(this.dir, min, max).then(function (img) {
            var len = img.length;
            for (var i = 0; i < len; i++)
                _this.img.push(new clothimage_1.ClothImage(img[i], {}));
            _this.load_image();
        });
    };
    AppComponent.prototype.update_batch = function (number) {
        if (number)
            this.batch++;
        else if (this.batch != 0)
            this.batch--;
        this.load_batch();
    };
    AppComponent.prototype.load = function (number) {
        var temp = this.counter - this.batch * this.batch_size + number;
        if (temp > this.img.length - 1)
            this.update_batch(1);
        else if (temp < 0)
            this.update_batch(-1);
        this.counter += number;
        console.log(this.counter);
        var node = document.getElementById('img_number');
        node.value = this.counter.toString();
        this.img_load = false;
        this.load_image();
    };
    AppComponent.prototype.goto = function () {
        this.batch = Number(parseInt((this.counter / this.batch_size).toString()));
        console.log(this.batch, this.batch_size, this.counter);
        this.load_batch();
    };
    AppComponent.prototype.disablePrevious = function () {
        var val = this.counter - this.batch * this.batch_size;
        return val == this.min_counter;
    };
    AppComponent.prototype.disableNext = function () {
        return this.counter == this.max_counter - 1;
    };
    AppComponent.prototype.cropped = function (bounds) {
        this.cropperSettings.croppedHeight = bounds.bottom - bounds.top;
        this.cropperSettings.croppedWidth = bounds.right - bounds.left;
        this.img_bounds = {};
        this.img_bounds['left'] = bounds.left;
        this.img_bounds['top'] = bounds.top;
        this.img_bounds['bottom'] = bounds.bottom;
        this.img_bounds['right'] = bounds.right;
        this.img_bounds['width'] = bounds.width;
        this.img_bounds['height'] = bounds.height;
        console.log(this.img_bounds);
    };
    AppComponent.prototype.crop = function () {
        var image_data = document.getElementById('cropped_img').src, image_name = document.getElementById('img_name').value;
        image_data = image_data.substring(image_data.indexOf(',') + 1);
        console.log('Saving ', image_name, image_data.length);
        image_name = this.dir + '/' + image_name;
        this.service.saveImage(image_name, image_data).then(function (obj) {
            console.log(obj);
        });
    };
    AppComponent.prototype.save = function (number) {
        var _this = this;
        console.log('Saving data');
        var current_image = this.img[this.counter - this.batch * this.batch_size];
        current_image.data = {};
        current_image.bounds = this.img_bounds;
        for (var i = 0; i < this.keys.length; i++) {
            var val = document.getElementById('button_' + this.keys[i]).innerText;
            if (!val.indexOf('Select'))
                current_image.data[this.keys[i].toString()] = '';
            else
                current_image.data[this.keys[i].toString()] = val;
        }
        console.log(current_image.data);
        this.service.saveData(current_image).then(function (res) {
            console.log('Save', res);
            if (number)
                _this.crop();
        });
    };
    __decorate([
        core_1.ViewChild(ng2_img_cropper_1.ImageCropperComponent), 
        __metadata('design:type', ng2_img_cropper_1.ImageCropperComponent)
    ], AppComponent.prototype, "cropper", void 0);
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            moduleId: module.id,
            templateUrl: 'app.module.html',
            styleUrls: ['app.module.css']
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
            imports: [platform_browser_1.BrowserModule, http_1.HttpModule, forms_1.FormsModule, ngx_bootstrap_1.AccordionModule.forRoot(), ngx_bootstrap_1.BsDropdownModule.forRoot(), ngx_bootstrap_1.ButtonsModule.forRoot()],
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