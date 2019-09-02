import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {of, Subscription} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpRequest} from '@angular/common/http';
import {catchError, last, map, tap} from 'rxjs/operators';
import * as prettyBytes from 'pretty-bytes';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FileUploadModel} from '../../entry';

@Component({
  selector: 'app-media-upload',
  templateUrl: './media-upload.component.html',
  styleUrls: ['./media-upload.component.css']
})
export class MediaUploadComponent implements OnInit, AfterViewInit {

  /** multiple upload */
  @Input()
  multiple: boolean;

  private files: Array<FileUploadModel> = [];

  /** Target URL for file uploading. */
  @Input() target = 'api/v1/file';
  // @Input() target = 'https://file.io';

  /** Name used in form which will be sent in HTTP request. */
  @Input() param = 'file';

  /** File extension that accepted, same as 'accept' of <input type="file" />. By the default, it's set to 'image/*'. */
  @Input() accept = 'image/*';

  /** Allow you to add handler after its completion. Bubble up response text from remote. */
  @Output() completeEvent = new EventEmitter<string>();

  /** */
  dragOver;

  constructor(private httpClient: HttpClient, private snackBar: MatSnackBar) {
  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    const uploadDiv = document.getElementById('upload_div');

    uploadDiv.addEventListener('dragover', (event) => {
      event.preventDefault();
    }, false);

    uploadDiv.addEventListener('dragenter', (event) => {
      this.dragOver = true;
      event.preventDefault();
    }, false);

    uploadDiv.addEventListener('dragleave', (event) => {
      this.dragOver = false;
      event.preventDefault();
    }, false);

    uploadDiv.addEventListener('drop', (event) => {
      this.dragOver = false;
      event.preventDefault();
      event.stopPropagation();

      this.onSelectFiles(event.dataTransfer.files);
    }, false);
  }

// click select file button
  selectFile() {
    const fileUpload = document.getElementById('file_input') as HTMLInputElement;
    fileUpload.addEventListener('change', (event) => {
      this.onSelectFiles(fileUpload.files);
    });
    fileUpload.click();
  }

  onSelectFiles(files) {
    const tempFiles: Array<FileUploadModel> = [];
    for (const file of files) {
      tempFiles.push(new FileUploadModel(file));
    }
    const fileUpload = document.getElementById('file_input') as HTMLInputElement;
    fileUpload.value = '';
    tempFiles.forEach(file => {
      this.uploadFile(file);
    });
  }

  private uploadFile(file: FileUploadModel) {
    this.files.unshift(file);

    const formData = new FormData();
    formData.append(this.param, file.data);

    const req = new HttpRequest('POST', this.target, formData,
      {
        reportProgress: true,
        // headers: new HttpHeaders({
        //   'Access-Control-Allow-Origin': '*'
        // })
      }
    );

    file.inProgress = true;
    file.sub = this.httpClient.request(req)
      .pipe(
        map(event => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              file.progress = Math.round(event.loaded * 100 / event.total);
              console.log(file.progress);
              break;
            case HttpEventType.Response:
              return event;
          }
        }),
        tap(message => {
        }),
        last(),
        catchError((error: HttpErrorResponse) => {
          file.inProgress = false;
          file.canRetry = true;
          file.status = -1;
          return of(`${file.data.name} upload failed.`);
        })
      )
      .subscribe((event: any) => {
        if (typeof (event) === 'object') {
          // this.removeFileFromArray(file);
          file.status = 1;
          file.result = event.body;
          this.completeEvent.emit(event.body);
        }
        console.log(event);
      });
  }

  private removeFileFromArray(file: FileUploadModel) {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
    }
  }

  cancelFile(file: FileUploadModel) {
    file.sub.unsubscribe();
    this.removeFileFromArray(file);
  }

  retryFile(file: FileUploadModel) {
    this.uploadFile(file);
    file.canCancel = false;
  }

  copyLinkSuccess() {
    this.snackBar.open('复制成功', '', {duration: 2000});
  }

  copyLinkFail() {
    this.snackBar.open('复制失败', '', {duration: 2000});
  }
}
