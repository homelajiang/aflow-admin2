import {Component, OnInit} from '@angular/core';
import {LoadStatus, PageModel, Tag} from '../entry';
import {MatDialog} from "@angular/material/dialog";
import {BlogService} from "../blog/blog.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBar} from "../utils/snack-bar";

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
        SnackBar.open(this.snackBar, error)
        this.loadingStatus = LoadStatus.LOAD_MORE;
      });
  }

  deleteTag(tag: Tag) {

  }

  editTag(tag: Tag) {

  }

  createTag() {

  }

  private onLoadMore() {
    this.getTags(false);
  }

}
