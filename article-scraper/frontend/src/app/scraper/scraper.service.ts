import { Injectable } from '@angular/core'
import { Headers, Http } from '@angular/http'
import 'rxjs/add/operator/toPromise'

import { Article } from '../class/article'

@Injectable()

export class ScraperService {
    headers: Headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
    })
    constructor(private http: Http) { }
    getLinks(name: String): Promise<Number> {
        let body = 'filename=' + name
        return this.http.post('http://localhost:9999/db/links/', body, {
            headers: this.headers
        }).toPromise()
          .then(res => res.json().count as Number)
          .catch(this.handleError)
    }
    scrape(name:String, start: Number, stop: Number): Promise<JSON> {
        let body = 'filename=' + name + '&start=' + start + '&stop=' + stop
        return this.http.post('http://localhost:9999/db/data/', body, {
            headers: this.headers
        }).toPromise()
          .then(res => res.json() as JSON)
          .catch(this.handleError)
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error)
        return Promise.reject(error.message || error)
  }
}