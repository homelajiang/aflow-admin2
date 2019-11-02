import {Component, Inject, OnInit} from '@angular/core';
import {Categories, LoadStatus, Media, PageModel} from '../entry';
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
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  private loadingStatus: number;
  private searchText: string;
  private page = 1;

  // tags: Array<Tag> = [];
  //
  // categoriesArray: Array<Categories> = [];

  dataList;

  constructor(private dialog: MatDialog, private blogService: BlogService,
              private snackBar: MatSnackBar, private router: Router) {
    this.dataList = new Array<Categories>();
  }

  ngOnInit() {
    this.getDataList(true);
  }

  private getDataList(refresh: boolean) {
    this.loadingStatus = LoadStatus.LOADING;
    if (refresh) {
      this.page = 1;
    }

    this.blogService.getCategories(this.page, this.searchText)
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

  deleteCategories(categories: any, index: number) {
    const deleteDialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: '提示',
        content: '是否删除该分类？',
        color: 'warn'
      }
    });
    deleteDialogRef.afterClosed()
      .pipe(
        filter(remove => remove),
        switchMap(() => {
          return this.blogService.removeCategories(categories.id);
        })
      )
      .subscribe(() => {
        SnackBar.open(this.snackBar, '删除成功');
        this.dataList.splice(index, 1);
        // this.tags.splice(this.tags.findIndex(item => item.id === categories.id), 1);
      }, error => {
        SnackBar.open(this.snackBar, error);
      });
  }

  editCategories(categories: any, index: number) {
    const data = JSON.parse(JSON.stringify(categories));
    const createTagDialogRef = this.dialog.open(CreateCategoriesDialogComponent, {
      data: {data}
    });
    this.saveData(createTagDialogRef, false, index);
  }

  createCategories() {
    const createTagDialogRef = this.dialog.open(CreateCategoriesDialogComponent, {});
    this.saveData(createTagDialogRef, true);
  }

  private saveData(dialogRef: MatDialogRef<CreateCategoriesDialogComponent, any>, isCreate: boolean, index?: number) {
    let categories: Categories;
    dialogRef.afterClosed()
      .pipe(
        filter(event => {
          return event;
        }),
        switchMap((temp: Categories) => {
          categories = temp;
          if (temp.image && temp.image.startsWith('data:')) {
            const file: File = Decoder.dataURLtoFile(temp.image, `tag_${temp.name}`);
            return this.blogService.uploadFile(file);
          } else {
            return of(0);
          }
        }),
        switchMap(res => {
          if (typeof res === 'object') {
            categories.image = res.body.path;
          }
          if (isCreate) {
            return this.blogService.createCategories(categories);
          } else {
            return this.blogService.updateCategories(categories);
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
  selector: 'app-create-categories-dialog',
  templateUrl: './create-categories-dialog.component.html',
  styleUrls: ['./create-categories-dialog.component.css']
})
export class CreateCategoriesDialogComponent implements OnInit {

  categories: any;
  newCategories: boolean;

  constructor(public snackBar: MatSnackBar, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<CreateCategoriesDialogComponent>) {

    if (this.data && this.data.data) {
      this.categories = this.data.data;
      this.newCategories = false;
    } else {
      this.newCategories = true;
      this.categories = new Categories();
    }
  }

  ngOnInit() {
  }

  createTag() {
    if (!this.categories.name) {
      SnackBar.open(this.snackBar, '分类名称必须填写');
      return;
    }
    this.dialogRef.close(this.categories);
  }

  changeCover() {
    const cropImageDialogRef = this.dialog.open(ImageCropDialogComponent);
    cropImageDialogRef.afterClosed()
      .subscribe((res) => {
        this.categories.image = res;
      });
  }

  getDialogTitle() {
    return this.newCategories ? '新建分类' : '编辑分类';
  }
}
