import {Component, OnInit} from '@angular/core';
import {Media} from '../../entry';
import {MatDialogRef, MatSnackBar} from '@angular/material';
import {SnackBar} from '../../utils/snack-bar';

@Component({
  selector: 'app-image-select-dialog',
  templateUrl: './image-select-dialog.component.html',
  styleUrls: ['./image-select-dialog.component.css']
})
export class ImageSelectDialogComponent implements OnInit {

  selectMedias: Array<Media> = [];

  constructor(public dialogRef: MatDialogRef<ImageSelectDialogComponent>,
              private snackbar: MatSnackBar) {
  }

  ngOnInit() {
  }

  mediaSelect(medias: Array<Media>) {
    this.selectMedias = medias;
  }

  closeDialog() {
    if (this.selectMedias.length === 0) {
      SnackBar.open(this.snackbar, '请选择');
      return;
    }
    this.dialogRef.close(this.selectMedias);
  }
}
