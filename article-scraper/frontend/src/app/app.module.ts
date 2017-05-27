import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpModule } from '@angular/http'
import { RouterModule, Routes } from '@angular/router'

import { AppComponent } from './app.component'
import { HomeComponent } from './home/home.component'
import { ScraperComponent } from './scraper/scraper.component'
import { JSONViewComponent } from './jsonview/jsonview.component'
import { UrlScraperComponent } from './urlscraper/urlscraper.component'

import { ScraperService } from './scraper/scraper.service'
import { JSONViewService } from './jsonview/jsonview.service'
import { UrlScraperService } from './urlscraper/urlscraper.service'

const appRoutes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'scraper', component: ScraperComponent},
  {path: 'jsonview', component: JSONViewComponent},
  {path: 'urlscraper', component: UrlScraperComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'}
]

@NgModule({
  imports: [BrowserModule, HttpModule, RouterModule.forRoot(appRoutes)],
  declarations: [AppComponent, HomeComponent, ScraperComponent, UrlScraperComponent, JSONViewComponent],
  bootstrap: [AppComponent],
  providers: [ScraperService, UrlScraperService, JSONViewService]
})

export class AppModule {}