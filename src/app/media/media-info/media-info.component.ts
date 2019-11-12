import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Media, MediaWrapper} from '../../entry';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {SnackBar} from '../../utils/snack-bar';
import {MatSnackBar} from '@angular/material/snack-bar';
import {filter, flatMap, switchMap} from 'rxjs/operators';
import {BlogService} from '../../blog/blog.service';
import {ConfirmDialogComponent} from '../../component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-media-info',
  templateUrl: './media-info.component.html',
  styleUrls: ['./media-info.component.css']
})
export class MediaInfoComponent implements OnInit {
  private media: Media;
  private medias: Array<Media> = [];
  private index: number;
  private total: number;
  private loadingStatus: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog,
              private blogService: BlogService, private snackBar: MatSnackBar) {
    this.index = data.index;
    this.medias = data.medias;
    this.media = this.medias[this.index];
    this.total = data.total;
  }

  ngOnInit() {
  }

  private onEditMediaInfo() {
    this.dialog.open(MediaInfoEditDialogComponent, {
      data: {media: JSON.parse(JSON.stringify(this.media))}
    })
      .afterClosed()
      .pipe(
        filter(res => res),
        switchMap((res: Media) => {
          return this.blogService.updateMedia(res.id, res);
        })
      )
      .subscribe(result => {
        this.media = result;
        const wrapper = new MediaWrapper();
        wrapper.index = this.index;
        wrapper.media = this.media;
        this.blogService.updateMediaMessage.next(wrapper);
      }, error => SnackBar.open(this.snackBar, error));
  }

  private deleteMedia() {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        content: '是否永久删除该文件？',
        color: 'warn'
      }
    })
      .afterClosed()
      .pipe(
        filter(res => {
          return res;
        }),
        switchMap(() => {
          return this.blogService.removeMedia(this.media.id);
        })
      )
      .subscribe((res) => {
        SnackBar.open(this.snackBar, '删除成功');
        this.blogService.deleteMediaMessage.next(this.index);
        // this.medias.splice(this.index, 1);
        this.total--;
        this.index = this.index === 0 ? 0 : this.index - 1;
        this.media = this.medias[this.index];
      }, error => SnackBar.open(this.snackBar, error));
  }

  private toPre() {
    if (this.index !== 0) {
      this.index--;
      this.media = this.medias[this.index];
    }
  }

  private toNext() {
    if (this.index + 1 < this.total) {
      this.index++;
      this.media = this.medias[this.index];
    }
  }

}

@Component({
  selector: 'app-media-info-edit-dialog',
  templateUrl: './media-info-edit-dialog.component.html'
})
export class MediaInfoEditDialogComponent implements OnInit {
  private readonly media: Media;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<MediaInfoEditDialogComponent>) {
    this.media = data.media;
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submitEdit() {
    if (!this.media.name) {
      SnackBar.open(this.snackBar, '名称不能为空');
      return;
    }
    this.dialogRef.close(this.media);
  }
}
