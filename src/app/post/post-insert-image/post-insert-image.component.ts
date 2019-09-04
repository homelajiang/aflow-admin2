import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FileUploadModel, Media} from '../../entry';
import {HttpClient, HttpErrorResponse, HttpEventType, HttpRequest} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {catchError, last, map, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {PostListComponent} from '../post-list/post-list.component';
import {MediaListComponent} from '../../media/media-list/media-list.component';
import {SnackBar} from '../../utils/snack-bar';

@Component({
  selector: 'app-post-insert-image',
  templateUrl: './post-insert-image.component.html',
  styleUrls: ['./post-insert-image.component.css']
})
export class PostInsertImageComponent implements OnInit, AfterViewInit {

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

  selectMedias: Array<Media> = [];

  constructor(private httpClient: HttpClient, private snackBar: MatSnackBar) {
  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
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

  onSelectMedia(medias: Array<Media>) {
    this.selectMedias = medias;
  }
}
