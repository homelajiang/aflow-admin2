import {Component, OnInit} from '@angular/core';
import {BlogService} from '../blog/blog.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  viewCountStatistics;
  postCountStatistics;
  commentCountStatistics;
  storageStatistics;

  todoList = [];

  postList = [];
  postStatisticsType = 'view';
  postStatisticsRang = 'week';
  todoPage = 1;

  constructor(private blogService: BlogService) {
  }

  ngOnInit() {
    this.getStatisticsCount('view');
    this.getStatisticsCount('post');
    this.getStatisticsCount('comment');
    this.getStorageStatistics();

    this.getPostStatistics(this.postStatisticsType, this.postStatisticsRang);
    this.getTodo();
  }

  getStatisticsCount(type: string) {
    if ('post' === type || 'comment' === type) {
      this.blogService.getStatistics(type, 5)
        .subscribe(res => {
          if ('post' === type) {
            this.postCountStatistics = res;
          } else if ('comment' === type) {
            this.commentCountStatistics = res;
          }
        });
    } else {
      this.blogService.getStatistics('view', 20)
        .subscribe(res => {
          this.viewCountStatistics = res;
        });
    }
  }

  getPostStatistics(type: string, rang: string) {
    this.blogService.getPostStatistics(type, rang)
      .subscribe(res => {
        this.postList = res;
      });
  }

  getStorageStatistics() {
    this.blogService.getStorageStatistics()
      .subscribe(res => {
        this.storageStatistics = res;
      });
  }

  getTodo() {
    this.blogService.getTodo(this.todoPage)
      .subscribe(res => {
        this.todoList.concat(res.list);
      });
  }

}
