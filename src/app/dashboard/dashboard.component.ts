import {Component, OnInit} from '@angular/core';
import {BlogService} from '../blog/blog.service';
import {ChartDataSets, ChartOptions} from 'chart.js';
import {Color, Label} from 'ng2-charts';
import {MediaStorage, Post} from '../entry';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  viewCountData: ChartDataSets[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'}
  ];
  viewCountLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  viewCountColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  viewCountType = 'line';
  viewCountOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        id: 'x-axis-1',
        position: 'bottom',
        gridLines: {
          display: false,
          color: 'rgba(255,0,0,0.3)',
        },
        ticks: {
          // display: false,
          // reverse: true,
          fontColor: 'red',
        }
      }],
      yAxes: [{
        id: 'y-axis-a',
        gridLines: {
          display: false
        }
      }],
    }
  };

  postCountData: ChartDataSets[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'}
  ];
  postCountLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  postCountColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  postCountType = 'line';

  commentCountData: ChartDataSets[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'}
  ];
  commentCountLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  commentCountColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  commentCountType = 'line';

  viewCountStatistics;
  postCountStatistics;
  commentCountStatistics;
  storageStatistics: MediaStorage = new MediaStorage();

  todoList = [];

  postList: Array<Post> = [];
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
