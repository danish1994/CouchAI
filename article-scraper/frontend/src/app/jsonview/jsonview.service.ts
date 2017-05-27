import { Injectable } from '@angular/core'
import { Headers, Http } from '@angular/http'
import 'rxjs/add/operator/toPromise'

import { Article } from '../class/article'

@Injectable()

export class JSONViewService {
    headers: Headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
    })
    constructor(private http: Http) { }
    getData(name: String, start: Number, stop: Number): Promise<Array<Article>> {
        let body = 'filename=' + name + '&start=' + start + '&stop=' + stop
        return this.http.post('http://localhost:9999/db/view/', body, {
            headers: this.headers
        }).toPromise()
          .then(res => res.json().data as Array<Article>)
          .catch(this.handleError)
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error)
        return Promise.reject(error.message || error)
  }
}