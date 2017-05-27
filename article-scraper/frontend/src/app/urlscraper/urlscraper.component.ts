import { Component } from '@angular/core'

import { UrlScraperService } from './urlscraper.service' 

@Component({
    selector: 'urlscraper',
    moduleId: module.id,
    templateUrl: 'urlscraper.component.html',
    styleUrls: ['urlscraper.component.css']
})

export class UrlScraperComponent {
    url: Array<String>
    node: HTMLLIElement
    constructor(private service: UrlScraperService) { }
    scrape() {
        let str = (<HTMLTextAreaElement>document.getElementById('url-list')).value.split('\n')
        console.log(str)
        this.node = document.createElement('li')
        this.node.innerText = 'Processing ' + str.length + ' links'
        document.getElementById('list').appendChild(this.node)
        str.map((val) => {
            this.service.scrape(val).then((res) => {
                console.log(val, res)
            })
        })
    }
}