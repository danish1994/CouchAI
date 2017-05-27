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
var urlscraper_service_1 = require('./urlscraper.service');
var UrlScraperComponent = (function () {
    function UrlScraperComponent(service) {
        this.service = service;
    }
    UrlScraperComponent.prototype.scrape = function () {
        var _this = this;
        var str = document.getElementById('url-list').value.split('\n');
        console.log(str);
        this.node = document.createElement('li');
        this.node.innerText = 'Processing ' + str.length + ' links';
        document.getElementById('list').appendChild(this.node);
        str.map(function (val) {
            _this.service.scrape(val).then(function (res) {
                console.log(val, res);
            });
        });
    };
    UrlScraperComponent = __decorate([
        core_1.Component({
            selector: 'urlscraper',
            moduleId: module.id,
            templateUrl: 'urlscraper.component.html',
            styleUrls: ['urlscraper.component.css']
        }), 
        __metadata('design:paramtypes', [urlscraper_service_1.UrlScraperService])
    ], UrlScraperComponent);
    return UrlScraperComponent;
}());
exports.UrlScraperComponent = UrlScraperComponent;
//# sourceMappingURL=urlscraper.component.js.map