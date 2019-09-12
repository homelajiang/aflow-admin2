import {Component, Inject, OnInit} from '@angular/core';
import {LoadStatus, Media, PageModel, Tag} from '../entry';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {BlogService} from '../blog/blog.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackBar} from '../utils/snack-bar';
import {Decoder} from '../utils/Decoder';
import {filter, map, switchMap} from 'rxjs/operators';
import {ConfirmDialogComponent} from '../component/confirm-dialog/confirm-dialog.component';
import {of} from 'rxjs';
import {ImageCropDialogComponent} from '../component/image-crop-dialog/image-crop-dialog.component';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {

  private loadingStatus: number;
  private searchText: string;
  private page = 1;

  tags: Array<Tag> = [];

  constructor(private dialog: MatDialog, private blogService: BlogService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getTags(true);
  }

  private getTags(refresh: boolean) {
    this.loadingStatus = LoadStatus.LOADING;
    if (refresh) {
      this.page = 1;
    }
    this.blogService.getTags(this.page, this.searchText)
      .subscribe((tagPage: PageModel<Tag>) => {
        this.page++;
        if (refresh) {
          this.tags = tagPage.list;
        } else {
          this.tags = this.tags.concat(tagPage.list);
        }

        tagPage.hasNextPage ? this.loadingStatus = LoadStatus.LOAD_MORE :
          this.loadingStatus = LoadStatus.NO_MORE;
      }, error => {
        SnackBar.open(this.snackBar, error);
        this.loadingStatus = LoadStatus.LOAD_MORE;
      });
  }

  deleteTag(tag: Tag, index: number) {
    const deleteDialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: '提示',
        content: '是否删除该标签？',
        color: 'warn'
      }
    });
    deleteDialogRef.afterClosed()
      .pipe(
        filter(remove => remove),
        switchMap(() => {
          return this.blogService.removeTag(tag.id);
        })
      )
      .subscribe(() => {
        SnackBar.open(this.snackBar, '删除成功');
        this.tags.splice(index, 1);
        // this.tags.splice(this.tags.findIndex(item => item.id === tag.id), 1);
      }, error => {
        SnackBar.open(this.snackBar, error);
      });
  }

  editTag(tag: Tag, index: number) {
    // copy the tag
    const temp = new Tag();
    temp.id = tag.id;
    temp.name = tag.name;
    temp.description = tag.description;
    temp.color = tag.color;
    temp.image = tag.image;
    temp.alias = tag.alias;
    const createTagDialogRef = this.dialog.open(CreateTagDialogComponent, {
      data: {tag: temp}
    });
    this.saveTag(createTagDialogRef, false, index);
  }

  createTag() {
    const createTagDialogRef = this.dialog.open(CreateTagDialogComponent);
    this.saveTag(createTagDialogRef, true);
  }

  private saveTag(dialogRef: MatDialogRef<CreateTagDialogComponent, any>, isCreate: boolean, index?: number) {
    let tempTag: Tag;
    dialogRef.afterClosed()
      .pipe(
        filter(event => {
          return event;
        }),
        switchMap((tag: Tag) => {
          tempTag = tag;
          if (tag.image && tag.image.startsWith('data:')) {
            const file: File = Decoder.dataURLtoFile(tag.image, `tag_${tag.name}`);
            return this.blogService.uploadFile(file);
          } else {
            return of(0);
          }
        }),
        switchMap(res => {
          if (typeof res === 'object') {
            tempTag.image = res.body.path;
          }
          if (isCreate) {
            return this.blogService.createTag(tempTag);
          } else {
            return this.blogService.updateTag(tempTag);
          }
        })
      )
      .subscribe((tag: Tag) => {
        if (isCreate) {
          this.tags.unshift(tag);
        } else {
          this.tags[index] = tag;
        }
      }, error => {
        SnackBar.open(this.snackBar, error);
      });
  }

  private onLoadMore() {
    this.getTags(false);
  }

  onSearch(keyword: string) {
    this.searchText = keyword;
    this.getTags(true);
  }
}

@Component({
  selector: 'app-create-tag-dialog',
  templateUrl: './create-tag-dialog.component.html',
  styleUrls: ['./create-tag-dialog.component.css']
})
export class CreateTagDialogComponent implements OnInit {

  tag: Tag;
  newTag: boolean;

  constructor(public snackBar: MatSnackBar, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
              public blogService: BlogService, public dialogRef: MatDialogRef<CreateTagDialogComponent>) {
    if (this.data) {
      this.tag = data.tag;
      this.newTag = false;
    } else {
      this.tag = new Tag();
      this.newTag = true;
    }
  }

  ngOnInit() {
  }

  createTag() {
    if (!this.tag.name) {
      SnackBar.open(this.snackBar, '标签名称必须填写');
      return;
    }
    this.dialogRef.close(this.tag);
  }

  changeCover() {
    const cropImageDialogRef = this.dialog.open(ImageCropDialogComponent);
    cropImageDialogRef.afterClosed()
      .subscribe((res) => {
        this.tag.image = res;
      });
  }
}
