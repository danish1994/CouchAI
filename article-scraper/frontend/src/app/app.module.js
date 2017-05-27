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
var router_1 = require('@angular/router');
var app_component_1 = require('./app.component');
var home_component_1 = require('./home/home.component');
var scraper_component_1 = require('./scraper/scraper.component');
var jsonview_component_1 = require('./jsonview/jsonview.component');
var urlscraper_component_1 = require('./urlscraper/urlscraper.component');
var scraper_service_1 = require('./scraper/scraper.service');
var jsonview_service_1 = require('./jsonview/jsonview.service');
var urlscraper_service_1 = require('./urlscraper/urlscraper.service');
var appRoutes = [
    { path: 'home', component: home_component_1.HomeComponent },
    { path: 'scraper', component: scraper_component_1.ScraperComponent },
    { path: 'jsonview', component: jsonview_component_1.JSONViewComponent },
    { path: 'urlscraper', component: urlscraper_component_1.UrlScraperComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
];
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, http_1.HttpModule, router_1.RouterModule.forRoot(appRoutes)],
            declarations: [app_component_1.AppComponent, home_component_1.HomeComponent, scraper_component_1.ScraperComponent, urlscraper_component_1.UrlScraperComponent, jsonview_component_1.JSONViewComponent],
            bootstrap: [app_component_1.AppComponent],
            providers: [scraper_service_1.ScraperService, urlscraper_service_1.UrlScraperService, jsonview_service_1.JSONViewService]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map