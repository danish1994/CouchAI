import { Component } from '@angular/core'

import { Article } from '../class/article'
import { ScraperService } from './scraper.service'

@Component({
  selector: 'scraper',
  moduleId: module.id,
  templateUrl: 'scraper.component.html',
  styleUrls: ['scraper.component.css']
})

export class ScraperComponent {
  node: HTMLLIElement
  name: String = 'idiva'
  websites: Array<String> = ['idiva']
  constructor(private service: ScraperService) { }
  scrape() {
    this.node = document.createElement('li')
    this.node.innerText = 'Scraping ' + this.name
    document.getElementById('list').appendChild(this.node)
    this.service.getLinks(this.name).then((res) => {
      this.node = document.createElement('li')
      this.node.innerText = 'New links - ' + res
      document.getElementById('list').appendChild(this.node)
      let batches = Number(res), bcount = batches/20
      if(batches != 0) {
        this.node = document.createElement('li')
        this.node.innerText = 'Working...'
        document.getElementById('list').appendChild(this.node)
        for(let bno=1;bno<=batches;bno++) {
          this.service.scrape(this.name, bno-1, bno).then((resp) => {
            let text = 'Scraping [', done = false
            for(let i=0;i<20;i++) {
              if(!done) {
                let q = bno/bcount
                if(q >= 1)
                  while(q >= 1) {
                    text+= '='
                    q--
                    i++
                  }
                done = true
              }
              else
                text+= '-'
            }
            text+= '] ' + Number((bno/batches*100)).toFixed(2) + '%'
            this.node.innerText = text
            document.getElementById('list').appendChild(this.node)
            if(bno == batches) {
              setTimeout(() => {
                this.node = document.createElement('li')
                this.node.innerText = batches + ' links scraped!'
                document.getElementById('list').appendChild(this.node)
              }, 2000)
            }
          })
        }
      }
      else {
        this.node = document.createElement('li')
        this.node.innerText = 'No new links!'
        document.getElementById('list').appendChild(this.node)
      }
    })
  }
}