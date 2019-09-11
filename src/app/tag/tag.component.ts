import {Component, OnInit} from '@angular/core';
import {LoadStatus, Media, PageModel, Tag} from '../entry';
import {MatDialog} from '@angular/material/dialog';
import {BlogService} from '../blog/blog.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackBar} from '../utils/snack-bar';
import {CreateTagComponent} from './create-tag/create-tag.component';
import {Decoder} from '../utils/Decoder';
import {map} from 'rxjs/operators';

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

  constructor(private dialog: MatDialog, private blogService: BlogService, private snackBar: MatSnackBar) {
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

  deleteTag(tag: Tag) {

  }

  editTag(tag: Tag) {

  }

  createTag() {
    const createTagDialogRef = this.dialog.open(CreateTagComponent);
    createTagDialogRef.afterClosed().subscribe(tag => {
      if (!tag) {
        return;
      }
      if (!tag.title) {
        SnackBar.open(this.snackBar, '标签名称不能为空');
        return;
      }
      if (tag.cover) {
        const file: File = Decoder.dataURLtoFile(tag.cover, `tag_${tag.title}`);
        this.blogService.uploadFile(file)
          .pipe(
          )
          .subscribe(res => {
            tag.cover = res.body.path;
            this.saveTag(tag);
          }, err => {
            SnackBar.open(this.snackBar, '图片上传失败');
          });
      } else {
        this.saveTag(tag);
      }

    });

  }

  saveTag(tag: any) {
    const temp = new Tag();
    temp.name = tag.title;
    temp.description = tag.description;
    temp.image = tag.cover;
    this.blogService.createTag(temp)
      .subscribe(res => {
          console.log(res);
          this.tags.unshift(res);
        }
      );
  }

  private onLoadMore() {
    this.getTags(false);
  }

}
