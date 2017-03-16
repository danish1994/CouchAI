import { NgModule, ViewChild, Component }      from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpModule } from '@angular/http'
import { FormsModule } from '@angular/forms'
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper'
import { Subscription } from 'rxjs/Subscription'

import { ClothImage } from './clothimage'
import { Service } from './app.service'

@Component({
  selector: 'my-app',
  template: `<div id="all">
              <img-cropper [image]="data" [settings]="cropperSettings" (onCrop)="cropped($event)"></img-cropper><br>
              <button (click)="crop()">Crop</button>
              <label *ngIf="img_load == false">Image Loading</label>
              <img *ngIf="data.image" hidden id="cropped_img" [src]="data.image" [width]="cropperSettings.croppedWidth" [height]="cropperSettings.croppedHeight">
              <div id="load">
                <input type="number" min="20" step="20" [(ngModel)]="batch_size"/>
                <button (click)="load_batch()">Load</button>
                <button (click)="update_batch(-1)">Previous Batch</button>
                <button (click)="update_batch(1)">Next Batch</button>
              </div>
              <div id="access">
                <button (click)="load(-1)">Previous</button>
                <button (click)="load(1)">Next</button>
                <input type="number" [(ngModel)]="counter" min="0"/>
                <button (click)="load(0)">Go</button>
              </div>
              <div id="data">
                Name:<input type="text" id="img_name" readonly/>
                Other:<input type="text" id="other" readonly/>
                Saved:<label *ngIf="data.image">{{saved}}</label><br/>
                <button (click)="add_field()">Add Field</button>
                <table>
                  <thead *ngIf="data_fields != 0">
                    <th>Key</th>
                    <th>Value</th>
                    <th></th>
                  </thead>
                  <tbody id="fields">
                    <tr *ngFor="let i of arr" id="data_{{i}}">
                      <td><input id="key_{{i}}" type="text"/></td>
                      <td><input id="value_{{i}}" type="text"/></td>
                      <td><button (click)="del_field()">X</button></td>
                    </tr>
                  </tbody>
                </table>
                <button *ngIf="data_fields != 0" (click)="save(0)">Save</button>
              </div>
              <button *ngIf="data_fields != 0" (click)="save(1)">Crop & Save</button>
            </div>`
})

export class AppComponent  { 
  img: ClothImage[] = []
  img_data: Object = {}
  data: Object
  value: number
  counter: number = 0
  batch: number = 0
  batch_size: number = 0
  cropperSettings: CropperSettings
  data_fields: number = 0
  arr: Array<any> = []
  saved: string = 'Checking'
  img_load: boolean = false
  @ViewChild(ImageCropperComponent) cropper: ImageCropperComponent
  constructor(private service: Service) {
    this.cropperSettings = new CropperSettings()
    this.cropperSettings.keepAspect = false
    this.cropperSettings.noFileInput = true
    this.cropperSettings.preserveSize = true
    this.cropperSettings.fileType = 'jpeg'
    this.data = {}
  }
  load_image() {
    let current_image = this.img[this.counter]
    this.service.getImageData(current_image.filename).then((img) => {
      let img_ele = (<HTMLInputElement>document.getElementById('img_name')),
          other_ele = (<HTMLInputElement>document.getElementById('other'))
      this.service.check(current_image.name.toString()).then((res) => {
        console.log(res)
      })
      img_ele.value = current_image.name.toString()
      other_ele.value = current_image.metaname.toString()
      var image = new Image()
      image.src = 'data:image/jpeg;base64,' + img
      this.cropper.setImage(image)
      this.img_load = true
    })
  }
  load_batch() {
    this.img = []
    this.saved = 'Checking'
    let min = this.batch * this.batch_size,
        max = min + this.batch_size
    this.service.getImages(min, max).then((img) => {
      let len = img.length
      for(let i=0;i<len;i++)
        this.img.push(new ClothImage(img[i]))
      this.load_image()
    })
  }
  update_batch(number: number) {
    if(number)
      this.batch++
    else if(this.batch != 0)
      this.batch--
    this.load_batch()
  }
  load(number: number) {
    let temp = this.counter + number
    if(temp > this.img.length - 1)
      this.counter = 0
    else if(temp < 0)
      this.counter = this.img.length - 1
    else
      this.counter += number
    console.log(this.counter)
    this.img_load = false
    this.load_image()
  }
  add_field() {
    this.data_fields++
    this.arr = Array<any>(this.data_fields).fill(1).map((x, i)=>i+1)
    console.log('Adding', this.arr)
  }
  del_field() {
    this.data_fields--
    this.arr = Array<any>(this.data_fields).fill(1).map((x, i)=>i+1)
    console.log('Deleting', this.arr)
  }
  cropped(bounds:Bounds) {
    this.cropperSettings.croppedHeight =bounds.bottom-bounds.top;
    this.cropperSettings.croppedWidth = bounds.right-bounds.left;
  }
  crop() {
    let image_data = (<HTMLImageElement>document.getElementById('cropped_img')).src,
        image_name = (<HTMLInputElement>document.getElementById('img_name')).value
    image_data = image_data.substring(image_data.indexOf(',') + 1)
    console.log('Saving ', image_name, image_data.length)
    this.service.saveImage(image_name, image_data).then((obj) => {
      console.log(obj)
    })
  }
  save(number: number) {
    console.log('Saving data')
    if(number)
      this.crop()
    let current_image = this.img[this.counter]
    current_image.data = {}
    for(let i = 1;i<=this.data_fields;i++) {
      let key = (<HTMLInputElement>document.getElementById('key_' + i)).value,
          val = (<HTMLInputElement>document.getElementById('value_' + i)).value
      current_image.data[key] = val
    }
    this.service.saveData(current_image).then((res) => console.log(res))
  }
}

@NgModule({
  imports:      [ BrowserModule, HttpModule, FormsModule ],
  declarations: [ AppComponent, ImageCropperComponent ],
  bootstrap:    [ AppComponent ],
  providers: [ Service ]
})
export class AppModule { }