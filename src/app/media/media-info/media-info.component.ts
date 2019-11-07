import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Media} from '../../entry';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {SnackBar} from '../../utils/snack-bar';
import {MatSnackBar} from '@angular/material/snack-bar';
import {filter, switchMap} from 'rxjs/operators';
import {BlogService} from '../../blog/blog.service';

@Component({
  selector: 'app-media-info',
  templateUrl: './media-info.component.html',
  styleUrls: ['./media-info.component.css']
})
export class MediaInfoComponent implements OnInit {
  private media: Media;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog,
              private blogService: BlogService, private snackBar: MatSnackBar) {
    this.media = data.media;
  }

  ngOnInit() {
  }

  private onEditMediaInfo(media: Media) {
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
      }, error => SnackBar.open(this.snackBar, error));
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
