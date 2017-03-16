import { Injectable } from '@angular/core'
import { Headers, Http } from '@angular/http'
import 'rxjs/add/operator/toPromise'

import { ClothImage } from './clothimage'

@Injectable()

export class Service {
    headers: Headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*'
    })
    constructor(private http: Http) { }
    getImages(min: number, max: number): Promise<String[]>  {
        return this.http.get('http://localhost:8089/img/fs/' + min + '/' + max, {
            headers: this.headers
        }).toPromise()
          .then(res => res.json().files as String[])
          .catch(this.handleError)               
    }
    getImageData(filename: String): Promise<String> {
        var body = 'filename=' + filename
        return this.http.post('http://localhost:8089/img/fs', body, {
            headers: this.headers
        }).toPromise()
          .then(res => res.json().data as String)
          .catch(this.handleError)
    }
    saveImage(img_name: string, img_data: string): Promise<Object> {
        var body = 'name=' + img_name + '&data=' + img_data
        return this.http.post('http://localhost:8089/img/save', body, {
            headers: this.headers
        }).toPromise()
          .then(res => res.json() as Object)
          .catch(this.handleError)
    }
    saveData(cloth: ClothImage): Promise<Object> {
        var body = 'name=' + cloth.name + '&data=' + JSON.stringify(cloth.data)
        return this.http.post('http://localhost:8089/data', body, {
            headers: this.headers
        }).toPromise()
          .then(res => res.json() as Object)
          .catch(this.handleError)
    }
    check(name: string): Promise<Object> {
        return this.http.get('http://localhost:8089/data/' + name, {
            headers: this.headers
        }).toPromise()
          .then(res => res.json().data as Object)
          .catch(this.handleError)
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error)
        return Promise.reject(error.message || error)
  }
}