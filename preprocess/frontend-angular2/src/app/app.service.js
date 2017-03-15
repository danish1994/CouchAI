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
var http_1 = require('@angular/http');
require('rxjs/add/operator/toPromise');
var Service = (function () {
    function Service(http) {
        this.http = http;
        this.headers = new http_1.Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': '*'
        });
    }
    Service.prototype.getImages = function () {
        return this.http.get('http://localhost:8089/img/fs/0/100', {
            headers: this.headers
        }).toPromise()
            .then(function (res) { return res.json().files; })
            .catch(this.handleError);
    };
    Service.prototype.getImageData = function (filename) {
        var body = 'filename=' + filename;
        return this.http.post('http://localhost:8089/img/fs', body, {
            headers: this.headers
        }).toPromise()
            .then(function (res) { return res.json().data; })
            .catch(this.handleError);
    };
    Service.prototype.saveImage = function (img_name, img_data) {
        var body = 'name=' + img_name + '&data=' + img_data;
        return this.http.post('http://localhost:8089/img/save', body, {
            headers: this.headers
        }).toPromise()
            .then(function (res) { return res.json().data; })
            .catch(this.handleError);
    };
    Service.prototype.handleError = function (error) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    };
    Service = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], Service);
    return Service;
}());
exports.Service = Service;
//# sourceMappingURL=app.service.js.map