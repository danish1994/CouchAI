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
var scraper_service_1 = require('./scraper.service');
var ScraperComponent = (function () {
    function ScraperComponent(service) {
        this.service = service;
        this.name = 'idiva';
        this.websites = ['idiva'];
    }
    ScraperComponent.prototype.scrape = function () {
        var _this = this;
        this.node = document.createElement('li');
        this.node.innerText = 'Scraping ' + this.name;
        document.getElementById('list').appendChild(this.node);
        this.service.getLinks(this.name).then(function (res) {
            _this.node = document.createElement('li');
            _this.node.innerText = 'New links - ' + res;
            document.getElementById('list').appendChild(_this.node);
            var batches = Number(res), bcount = batches / 20;
            if (batches != 0) {
                _this.node = document.createElement('li');
                _this.node.innerText = 'Working...';
                document.getElementById('list').appendChild(_this.node);
                var _loop_1 = function(bno) {
                    _this.service.scrape(_this.name, bno - 1, bno).then(function (resp) {
                        var text = 'Scraping [', done = false;
                        for (var i = 0; i < 20; i++) {
                            if (!done) {
                                var q = bno / bcount;
                                if (q >= 1)
                                    while (q >= 1) {
                                        text += '=';
                                        q--;
                                        i++;
                                    }
                                done = true;
                            }
                            else
                                text += '-';
                        }
                        text += '] ' + Number((bno / batches * 100)).toFixed(2) + '%';
                        _this.node.innerText = text;
                        document.getElementById('list').appendChild(_this.node);
                        if (bno == batches) {
                            setTimeout(function () {
                                _this.node = document.createElement('li');
                                _this.node.innerText = batches + ' links scraped!';
                                document.getElementById('list').appendChild(_this.node);
                            }, 2000);
                        }
                    });
                };
                for (var bno = 1; bno <= batches; bno++) {
                    _loop_1(bno);
                }
            }
            else {
                _this.node = document.createElement('li');
                _this.node.innerText = 'No new links!';
                document.getElementById('list').appendChild(_this.node);
            }
        });
    };
    ScraperComponent = __decorate([
        core_1.Component({
            selector: 'scraper',
            moduleId: module.id,
            templateUrl: 'scraper.component.html',
            styleUrls: ['scraper.component.css']
        }), 
        __metadata('design:paramtypes', [scraper_service_1.ScraperService])
    ], ScraperComponent);
    return ScraperComponent;
}());
exports.ScraperComponent = ScraperComponent;
//# sourceMappingURL=scraper.component.js.map