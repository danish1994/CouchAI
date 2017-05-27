import { Component } from '@angular/core'

import { Article } from '../class/article'

import { JSONViewService } from './jsonview.service'

@Component({
    selector: 'jsonview',
    moduleId: module.id,
    templateUrl: 'jsonview.component.html',
    styleUrls: ['jsonview.component.css']
})

export class JSONViewComponent {
    name: String = 'idiva'
    headers: Array<String> = ['Id', 'Image', 'Title', 'Category', 'Description', 'Url']
    arr: Array<Article>
    constructor(private service: JSONViewService) { 
        this.getJSONData()
    }
    getJSONData() {
        this.service.getData(this.name, 0, 10).then((res) => {
            console.log(res)
            this.arr = res
        })
    }
}