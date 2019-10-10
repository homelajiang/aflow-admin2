import {Component, OnInit} from '@angular/core';
import {BlogService} from '../blog/blog.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private blogService: BlogService) {
  }

  ngOnInit() {
    // 获取访问量
    this.blogService.getStatistics('view', 20)
      .subscribe(res => {

      });

    // 获取其他统计量
    this.blogService.getStatistics('post', 5)
      .subscribe(res => {

      });
    this.blogService.getStatistics('comment', 5)
      .subscribe(res => {

      });

  }

  getStatisticsCount(type: string) {
    if ('post' === type || 'comment' === type) {
      this.blogService.getStatistics(type, 5)
        .subscribe(res => {

        });
    } else {
      this.blogService.getStatistics('view', 20)
        .subscribe(res => {

        });
    }
  }

}
