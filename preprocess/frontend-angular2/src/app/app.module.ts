import { NgModule, ViewChild, Component, DoCheck } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpModule } from '@angular/http'
import { FormsModule } from '@angular/forms'
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper'
import { AccordionModule, BsDropdownModule, ButtonsModule } from 'ngx-bootstrap'

import { ClothImage } from './clothimage'
import { Service } from './app.service'

@Component({
  selector: 'my-app',
  moduleId: module.id,
  templateUrl: 'app.module.html',
  styleUrls: ['app.module.css']
})

export class AppComponent implements DoCheck {
  img: ClothImage[] = []
  img_data: Object = {}
  data: Object
  dir: String
  dirs: Array<String>
  value: number
  counter: number = 0
  min_counter: number = 0
  max_counter: number = 0
  img_number: number = 0
  batch: number = 0
  batch_size: number = 20
  cropperSettings: CropperSettings
  data_fields: number = 0
  saved: string = 'Checking...'
  current_keys: Array<String>
  img_load: boolean = false
  img_bounds: Object
  url: String
  keys: Array<String> = []
  values: Array<Array<String>> = Array(this.keys.length).fill([])
  @ViewChild(ImageCropperComponent) cropper: ImageCropperComponent
  constructor(private service: Service) {
    /*this.cropperSettings = new CropperSettings()
    this.cropperSettings.keepAspect = false
    this.cropperSettings.noFileInput = true
    this.cropperSettings.preserveSize = true
    this.cropperSettings.fileType = 'jpeg'
    this.data = {}*/
    this.service.getDirs().then((dirs) => {
      this.dirs = dirs
    })
    /*this.service.getDirs().then((dirs) => {
      this.dirs = dirs
      console.log(this.dirs)
    })*/
  }
  ngDoCheck() {
    let data = this.img[this.counter - this.batch * this.batch_size]
    try {
      if (data.data != undefined && Object.keys(data.data).length != 0) {
        for (let i = 0; i < this.keys.length; i++) {
          if(data.data[this.keys[i].toString()] == '')
            document.getElementById('button_' + this.keys[i]).innerText = 'Select ' + this.keys[i].toString()
          else
            document.getElementById('button_' + this.keys[i]).innerText = data.data[this.keys[i].toString()].toString()
        }
        this.saved = 'Loaded'
      }
    } catch (error) {}
  }
  clear() {
    for(let i = 0;i < this.keys.length; i++)
      document.getElementById('button_' + this.keys[i]).innerText = 'Select ' + this.keys[i].toString()
  } 
  updateDir(event: any) {
    let e = event || window.event
    let target = e.target || e.srcElement
    this.dir = target.id
    this.batch = 0
    this.counter = 0
    document.getElementById('category').innerText = target.id
    this.service.getCategories(this.dir).then((categories) => {
      this.keys = Object.keys(categories)
      this.values = categories
      console.log(this.keys, this.values)
      this.service.getCategoryCount(this.dir).then((count) => {
        this.max_counter = Number(count)
        this.load_batch()
      })
    })
  }
  updateVal(event: any) {
    let e = event || window.event
    let target = e.target || e.srcElement
    let temp = target.id.split('_')
    document.getElementById('button_' + temp[0]).innerText = temp[1]
  }
  load_image() {
    let current_image = this.img[this.counter - this.batch * this.batch_size]
    for (let i = 0; i < this.keys.length; i++)
        document.getElementById('button_' + this.keys[i]).innerText = 'Select ' + this.keys[i].toString()
    this.service.getImageData(this.dir, current_image.filename).then((img) => {
      let img_ele = ( < HTMLInputElement > document.getElementById('img_name'))
      img_ele.value = current_image.name.toString()
      var image = new Image()
      image.src = 'data:image/jpeg;base64,'
      let image_base_ele = (<HTMLImageElement>document.getElementById('product_image'))
      image_base_ele.src = 'data:image/jpeg;base64,' + img
      let temp = img.split('$')
      img = temp[0]
      this.url = temp[1]
      this.service.check(current_image.name.toString()).then((res) => {
        let data = JSON.parse(res.toString())
        if (data) {
          this.saved = 'Loading Data...'
          this.current_keys = Object.keys(data.data)
          this.data_fields = this.current_keys.length
          current_image.data = data.data
          if (data.imgData != null)
            image.src += data.imgData
          else
            image.src += img
        } else {
          this.saved = 'No Data'
          image.src += img
        }
        //this.cropper.setImage(image)
        this.img_load = true
      })
    })
  }
  load_batch() {
    this.img = []
    this.saved = 'Checking...'
    let min = this.batch * this.batch_size,
      max = min + this.batch_size
    this.service.getImages(this.dir, min, max).then((img) => {
      let len = img.length
      for (let i = 0; i < len; i++)
        this.img.push(new ClothImage(img[i], {}))
      this.load_image()
    })
  }
  update_batch(number: number) {
    if (number)
      this.batch++
      else if (this.batch != 0)
        this.batch--
        this.load_batch()
  }
  load(number: number) {
    let temp = this.counter - this.batch*this.batch_size + number
    if (temp > this.img.length - 1)
      this.update_batch(1)
    else if (temp < 0)
      this.update_batch(-1)
    this.counter += number
    console.log(this.counter)
    let node = <HTMLInputElement>document.getElementById('img_number')
    node.value = this.counter.toString()
    this.img_load = false
    this.load_image()
  }
  goto() {
    this.batch = Number(parseInt((this.counter/this.batch_size).toString()))
    console.log(this.batch, this.batch_size, this.counter)
    this.load_batch()
  }
  disablePrevious() {
    let val = this.counter - this.batch * this.batch_size
    return val == this.min_counter
  }
  disableNext() {
    return this.counter == this.max_counter - 1
  }
  cropped(bounds: Bounds) {
    this.cropperSettings.croppedHeight = bounds.bottom - bounds.top;
    this.cropperSettings.croppedWidth = bounds.right - bounds.left;
    this.img_bounds = {}
    this.img_bounds['left'] = bounds.left
    this.img_bounds['top'] = bounds.top
    this.img_bounds['bottom'] = bounds.bottom
    this.img_bounds['right'] = bounds.right
    this.img_bounds['width'] = bounds.width
    this.img_bounds['height'] = bounds.height
    console.log(this.img_bounds)
  }
  crop() {
    let image_data = ( < HTMLImageElement > document.getElementById('cropped_img')).src,
      image_name = ( < HTMLInputElement > document.getElementById('img_name')).value
    image_data = image_data.substring(image_data.indexOf(',') + 1)
    console.log('Saving ', image_name, image_data.length)
    image_name = this.dir + '/' + image_name
    this.service.saveImage(image_name, image_data).then((obj) => {
      console.log(obj)
    })
  }
  save(number: number) {
    console.log('Saving data')
    let current_image = this.img[this.counter - this.batch * this.batch_size]
    current_image.data = {}
    current_image.bounds = this.img_bounds
    for (let i = 0; i <this.keys.length; i++) {
      let val = ( < HTMLInputElement > document.getElementById('button_' + this.keys[i])).innerText
      if(!val.indexOf('Select'))
        current_image.data[this.keys[i].toString()] = ''
      else
        current_image.data[this.keys[i].toString()] = val
    }
    console.log(current_image.data)
    this.service.saveData(current_image).then((res) => {
      console.log('Save', res)
      if(number)
        this.crop()
    })
  }
}

@NgModule({
  imports: [BrowserModule, HttpModule, FormsModule, AccordionModule.forRoot(), BsDropdownModule.forRoot(), ButtonsModule.forRoot()],
  declarations: [AppComponent, ImageCropperComponent],
  bootstrap: [AppComponent],
  providers: [Service]
})
export class AppModule {}
