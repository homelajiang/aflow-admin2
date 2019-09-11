import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ImageCropDialogComponent} from '../../component/image-crop-dialog/image-crop-dialog.component';
import {Decoder} from '../../utils/Decoder';
import {BlogService} from '../../blog/blog.service';
import {FileUploadModel} from '../../entry';
import {SnackBar} from '../../utils/snack-bar';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-tag-dialog',
  templateUrl: './create-tag.component.html',
  styleUrls: ['./create-tag.component.css']
})
export class CreateTagComponent implements OnInit {

  tag = {
    title: '',
    description: '',
    cover: ''
  };

  constructor(public snackBar: MatSnackBar, public dialog: MatDialog, public blogService: BlogService) {
  }

  ngOnInit() {
  }


  changeCover() {
    const cropImageDialogRef = this.dialog.open(ImageCropDialogComponent);
    cropImageDialogRef.afterClosed()
      .subscribe((res) => {
        this.tag.cover = res;
      });
  }
}
