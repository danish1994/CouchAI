import { Injectable } from '@angular/core'
import { Headers, Http } from '@angular/http'
import 'rxjs/add/operator/toPromise'

@Injectable()

export class UrlScraperService {
    headers: Headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
    })
    constructor(private http: Http) { }
    scrape(uri: String): Promise<String> {
        let body = 'uri=' + uri
        return this.http.post('http://localhost:9999/db/url/', body, {
            headers: this.headers
        }).toPromise()
          .then(res => res.json().str as String)
          .catch(this.handleError)
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error)
        return Promise.reject(error.message || error)
  }
}