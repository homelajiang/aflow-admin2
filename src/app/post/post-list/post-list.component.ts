import {Component, OnInit} from '@angular/core';
import {LoadStatus, PageModel, Post} from '../../entry';
import {BlogService} from '../../blog/blog.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatButtonToggleChange} from '@angular/material/button-toggle';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  private searchText: string;
  private loadingStatus: number;
  private page = 1;
  private type = '100';
  private posts: Array<Post> = [];

  constructor(private blogService: BlogService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getPosts(true);
  }

  private getPosts(refresh: boolean) {
    this.loadingStatus = LoadStatus.LOADING;
    if (refresh) {
      this.page = 1;
    }
    this.blogService.getPosts(this.page, this.type, this.searchText)
      .subscribe((postPage: PageModel<Post>) => {
        this.page++;
        if (refresh) {
          this.posts = postPage.list;
        } else {
          this.posts = this.posts.concat(postPage.list);
        }

        postPage.hasNextPage ? this.loadingStatus = LoadStatus.LOAD_MORE :
          this.loadingStatus = LoadStatus.NO_MORE;
      });
  }

  changeType(typeChange: MatButtonToggleChange) {
    if (this.type === typeChange.value) {
      return;
    }
    this.type = typeChange.value;
    this.getPosts(true);
  }

  search(keyword: string) {
    this.searchText = keyword;
    this.getPosts(true);
  }

  private onLoadMore() {
    this.getPosts(false);
  }
}
