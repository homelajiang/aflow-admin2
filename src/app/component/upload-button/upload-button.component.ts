import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FileUploadModel, Media} from '../../entry';
import {BlogService} from '../../blog/blog.service';
import {SnackBar} from '../../utils/snack-bar';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.css']
})
export class UploadButtonComponent implements OnInit {

  @Output() uploadResult = new EventEmitter<Media>();

  constructor(private blogService: BlogService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  onChange(files) {
    if (files.length !== 1) {
      return;
    }
    this.uploadFile(new FileUploadModel(files[0]));
    const fileUpload = document.getElementById('file_input') as HTMLInputElement;
    fileUpload.value = '';
  }

  private uploadFile(file: FileUploadModel) {
    file.sub = this.blogService.uploadFileModel(file)
      .subscribe((event: any) => {
        if (typeof (event) === 'object') {
          file.status = 1;
          file.result = event.body;
          this.uploadResult.emit(event.body);
        } else {
          SnackBar.open(this.snackBar, event);
        }
      }, error => {
        console.log(error);
      });
  }
}
