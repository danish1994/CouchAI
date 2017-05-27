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
var jsonview_service_1 = require('./jsonview.service');
var JSONViewComponent = (function () {
    function JSONViewComponent(service) {
        this.service = service;
        this.name = 'idiva';
        this.headers = ['Id', 'Image', 'Title', 'Category', 'Description', 'Url'];
        this.getJSONData();
    }
    JSONViewComponent.prototype.getJSONData = function () {
        var _this = this;
        this.service.getData(this.name, 0, 10).then(function (res) {
            console.log(res);
            _this.arr = res;
        });
    };
    JSONViewComponent = __decorate([
        core_1.Component({
            selector: 'jsonview',
            moduleId: module.id,
            templateUrl: 'jsonview.component.html',
            styleUrls: ['jsonview.component.css']
        }), 
        __metadata('design:paramtypes', [jsonview_service_1.JSONViewService])
    ], JSONViewComponent);
    return JSONViewComponent;
}());
exports.JSONViewComponent = JSONViewComponent;
//# sourceMappingURL=jsonview.component.js.map