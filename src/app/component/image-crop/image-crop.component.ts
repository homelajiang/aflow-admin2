import {Component, OnInit, ViewChild} from '@angular/core';
import {CropperSettings, ImageCropperComponent} from 'ngx-img-cropper';

// https://github.com/web-dave/ngx-img-cropper
@Component({
  selector: 'app-image-crop',
  templateUrl: './image-crop.component.html',
  styleUrls: ['./image-crop.component.css']
})
export class ImageCropComponent implements OnInit {

  @ViewChild('cropper', {static: true})
  cropper: ImageCropperComponent;

  data: any;
  cropperSettings: CropperSettings;

  constructor() {

    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;

    this.cropperSettings.width = 100;
    this.cropperSettings.height = 100;
    this.cropperSettings.croppedWidth = 100;
    this.cropperSettings.croppedHeight = 100;
    this.cropperSettings.canvasWidth = 400;
    this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.rounded = false;
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;
    this.cropperSettings.cropperDrawSettings.strokeColor = '#fd4c5d';
    this.data = {};
  }

  ngOnInit() {
  }

  fileChangeListener($event) {
    const image: any = new Image();
    const file: File = $event.target.files[0];
    const myReader: FileReader = new FileReader();
    const that = this;
    myReader.onloadend = (loadEvent: any) => {
      image.src = loadEvent.target.result;
      that.cropper.setImage(image);
    };

    myReader.readAsDataURL(file);
  }

}
