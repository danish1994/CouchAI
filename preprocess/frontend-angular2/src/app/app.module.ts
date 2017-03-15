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
              <img *ngIf="data.image" id="cropped_img" [src]="data.image" [width]="cropperSettings.croppedWidth" [height]="cropperSettings.croppedHeight">
              <div id="access">
                <button (click)="load(1)">Next</button>
                <button (click)="load(-1)">Previous</button>
                <input type="number" [(ngModel)]="counter" min="0"/>
                <button (click)="load(0)">Go</button>
              </div>
              <div id="data">
                Name:<input type="text" id="img_name"/><br/>
                <button (click)="add_field()">Add Field</button>
                <table>
                  <thead *ngIf="data_fields != 0">
                    <th>Key</th>
                    <th>Value</th>
                    <th></th>
                  </thead>
                  <tbody id="fields">
                    <tr *ngFor="let i of arr" id="data_{{i}}">
                      <td id="key_{{i}}"><input type="text"/></td>
                      <td id="value_{{i}}"><input type="text"/></td>
                      <td><button (click)="del_field()">X</button></td>
                    </tr>
                  </tbody>
                </table>
                <button *ngIf="data_fields != 0" (click)="save">Save</button>
              </div>
            </div>`
})

export class AppComponent  { 
  img: ClothImage[]
  img_data: Object = {}
  data: Object
  value: number
  counter: number = 0
  cropperSettings: CropperSettings
  data_fields: number = 0
  arr: Array<any> = []
  @ViewChild(ImageCropperComponent) cropper: ImageCropperComponent
  constructor(private service: Service) {
    this.cropperSettings = new CropperSettings()
    this.cropperSettings.keepAspect = false
    this.cropperSettings.noFileInput = true
    this.cropperSettings.preserveSize = true
    this.cropperSettings.fileType = 'jpeg'
    this.data = {}
    this.service.getImages().then((img) => {
      this.img = img
      this.load_image()
    })
  }
  load_image() {
    this.service.getImageData(this.img[this.counter].toString()).then((img) => {
      let img_name = this.img[this.counter].toString(),
          img_ele = (<HTMLInputElement>document.getElementById('img_name'))
      img_ele.value = img_name.substring(0, img_name.indexOf('-'))
      var image = new Image()
      image.src = 'data:image/jpeg;base64,' + img
      this.cropper.setImage(image)
    })
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
    console.log(this.cropperSettings.croppedHeight, this.cropperSettings.croppedWidth)
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
}

@NgModule({
  imports:      [ BrowserModule, HttpModule, FormsModule ],
  declarations: [ AppComponent, ImageCropperComponent ],
  bootstrap:    [ AppComponent ],
  providers: [ Service ]
})
export class AppModule { }