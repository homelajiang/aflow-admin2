import {Component, Inject, OnInit} from '@angular/core';
import {Categories, LoadStatus, Media, PageModel, Tag} from '../entry';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {BlogService} from '../blog/blog.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackBar} from '../utils/snack-bar';
import {Decoder} from '../utils/Decoder';
import {filter, map, switchMap} from 'rxjs/operators';
import {ConfirmDialogComponent} from '../component/confirm-dialog/confirm-dialog.component';
import {Observable, of} from 'rxjs';
import {ImageCropDialogComponent} from '../component/image-crop-dialog/image-crop-dialog.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {

  private loadingStatus: number;
  private searchText: string;
  private page = 1;

  // tags: Array<Tag> = [];
  //
  // categoriesArray: Array<Categories> = [];

  dataList;

  // is categories page?
  categoriesRouter: boolean;

  constructor(private dialog: MatDialog, private blogService: BlogService,
              private snackBar: MatSnackBar, private router: Router) {
    this.categoriesRouter = (router.url === '/categories');
    this.dataList = this.categoriesRouter ? new Array<Categories>() : new Array<Tag>();
  }

  ngOnInit() {
    this.getDataList(true);
  }

  private getDataList(refresh: boolean) {
    this.loadingStatus = LoadStatus.LOADING;
    if (refresh) {
      this.page = 1;
    }

    this.getDataObservable()
      .subscribe((tagPage: PageModel<any>) => {
        this.page++;
        if (refresh) {
          this.dataList = tagPage.list;
        } else {
          this.dataList = this.dataList.concat(tagPage.list);
        }

        tagPage.hasNextPage ? this.loadingStatus = LoadStatus.LOAD_MORE :
          this.loadingStatus = LoadStatus.NO_MORE;
      }, error => {
        SnackBar.open(this.snackBar, error);
        this.loadingStatus = LoadStatus.LOAD_MORE;
      });
  }

  getDataObservable(): Observable<PageModel<any>> {
    return this.categoriesRouter ? this.blogService.getCategories(this.page, this.searchText) :
      this.blogService.getTags(this.page, this.searchText);
  }

  deleteTag(tag: any, index: number) {
    const deleteDialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: '提示',
        content: this.categoriesRouter ? '是否删除该分类？' : '是否删除该标签？',
        color: 'warn'
      }
    });
    deleteDialogRef.afterClosed()
      .pipe(
        filter(remove => remove),
        switchMap(() => {
          if (this.categoriesRouter) {
            return this.blogService.removeCategories(tag.id);
          } else {
            return this.blogService.removeTag(tag.id);
          }
        })
      )
      .subscribe(() => {
        SnackBar.open(this.snackBar, '删除成功');
        this.dataList.splice(index, 1);
        // this.tags.splice(this.tags.findIndex(item => item.id === tag.id), 1);
      }, error => {
        SnackBar.open(this.snackBar, error);
      });
  }

  editTag(tag: any, index: number) {
    let data;
    let createTagDialogRef;
    // copy the tag
    if (this.categoriesRouter) {
      data = new Categories();
    } else {
      data = new Tag();
      data.color = tag.color;
    }

    data.id = tag.id;
    data.name = tag.name;
    data.description = tag.description;
    data.image = tag.image;
    data.alias = tag.alias;
    createTagDialogRef = this.dialog.open(CreateTagDialogComponent, {
      data: {data, categories: this.categoriesRouter}
    });

    this.saveData(createTagDialogRef, false, index);
  }

  createTag() {
    const createTagDialogRef = this.dialog.open(CreateTagDialogComponent, {
      data: {categories: this.categoriesRouter}
    });
    this.saveData(createTagDialogRef, true);
  }

  private saveData(dialogRef: MatDialogRef<CreateTagDialogComponent, any>, isCreate: boolean, index?: number) {
    let tempTag: any;
    dialogRef.afterClosed()
      .pipe(
        filter(event => {
          return event;
        }),
        switchMap((tag: any) => {
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

          if (this.categoriesRouter) {
            if (isCreate) {
              return this.blogService.createCategories(tempTag);
            } else {
              return this.blogService.updateCategories(tempTag);
            }
          } else {
            if (isCreate) {
              return this.blogService.createTag(tempTag);
            } else {
              return this.blogService.updateTag(tempTag);
            }
          }
        })
      )
      .subscribe((tag: any) => {
        if (isCreate) {
          this.dataList.unshift(tag);
        } else {
          this.dataList[index] = tag;
        }
      }, error => {
        SnackBar.open(this.snackBar, error);
      });
  }

  private onLoadMore() {
    this.getDataList(false);
  }

  onSearch(keyword: string) {
    this.searchText = keyword;
    this.getDataList(true);
  }
}

@Component({
  selector: 'app-create-tag-dialog',
  templateUrl: './create-tag-dialog.component.html',
  styleUrls: ['./create-tag-dialog.component.css']
})
export class CreateTagDialogComponent implements OnInit {

  tag: any;
  newTag: boolean;
  isCategories: boolean;

  constructor(public snackBar: MatSnackBar, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<CreateTagDialogComponent>) {

    if (this.data.data) {
      this.tag = this.data.data;
      this.newTag = false;
    } else {
      this.newTag = true;
      this.tag = this.data.categories ? new Categories() : new Tag();
    }
    this.isCategories = this.data.categories;
  }

  ngOnInit() {
  }

  createTag() {
    if (!this.tag.name) {
      SnackBar.open(this.snackBar, this.isCategories ? '分类名称必须填写' : '标签名称必须填写');
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

  getDialogTitle() {
    if (this.newTag) {
      if (this.isCategories) {
        return '新建分类';
      } else {
        return '新建标签';
      }
    } else {
      if (this.isCategories) {
        return '编辑分类';
      } else {
        return '编辑标签';
      }
    }
  }
}
