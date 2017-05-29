import { Injectable } from '@angular/core'
import { Headers, Http } from '@angular/http'
import 'rxjs/add/operator/toPromise'

import { ClothImage } from './clothimage'

@Injectable()

export class Service {
    headers: Headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
    })
    ip = '52.66.124.222'
    proto = 'http://'
    port = 8089
    constructor(private http: Http) { }
    getDirs(): Promise<Array<String>> {
        return this.http.get(this.proto + this.ip + ':' + this.port + '/img/fs/dir', {
            headers: this.headers
        }).toPromise()
          .then(res => res.json().data as Array<String>)
          .catch(this.handleError)
    }
    getImages(dir: String, min: number, max: number): Promise<String[]>  {
        return this.http.get(this.proto + this.ip + ':' + this.port + '/img/fs/'  + dir + '/' + min + '/' + max, {
            headers: this.headers
        }).toPromise()
          .then(res => res.json().files as String[])
          .catch(this.handleError)               
    }
    getCategories(category: String): Promise<Array<Array<String>>> {
        var body = 'category=' + category
        return this.http.post(this.proto + this.ip + ':' + this.port + '/categories', body, {
            headers: this.headers
        }).toPromise()
          .then(res => res.json().data as Array<Array<String>>)
          .catch(this.handleError)
    }
    getCategoryCount(category: String): Promise<Number> {
        var body = 'category=' + category
        return this.http.post(this.proto + this.ip + ':' + this.port + '/categories/count', body, {
            headers: this.headers
        }).toPromise()
          .then(res => res.json().count as Number)
          .catch(this.handleError)
    }
    getImageData(dirname: String, filename: String): Promise<String> {
        var body = 'dirname=' + dirname + '&filename=' + filename
        return this.http.post(this.proto + this.ip + ':' + this.port + '/img/fs', body, {
            headers: this.headers
        }).toPromise()
          .then(res => res.json().data as String)
          .catch(this.handleError)
    }
    saveImage(img_name: string, img_data: string): Promise<Object> {
        var body = 'name=' + img_name + '&data=' + img_data
        return this.http.post(this.proto + this.ip + ':' + this.port + '/img/save', body, {
            headers: this.headers
        }).toPromise()
          .then(res => res.json() as Object)
          .catch(this.handleError)
    }
    saveData(cloth: ClothImage): Promise<Object> {
        var body = 'name=' + cloth.name + '&data=' + JSON.stringify(cloth.data) + '&bounds=' + JSON.stringify({})
        console.log(body)
        return this.http.post(this.proto + this.ip + ':' + this.port + '/data', body, {
            headers: this.headers
        }).toPromise()
          .then(res => res.json() as Object)
          .catch(this.handleError)
    }
    check(name: string): Promise<String> {
        return this.http.get(this.proto + this.ip + ':' + this.port + '/data/' + name, {
            headers: this.headers
        }).toPromise()
          .then(res => JSON.stringify(res.json().data) as String)
          .catch(this.handleError)
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error)
        return Promise.reject(error.message || error)
  }
}