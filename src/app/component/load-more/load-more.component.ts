import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LoadStatus} from '../../entry';

@Component({
  selector: 'app-load-more',
  templateUrl: './load-more.component.html',
  styleUrls: ['./load-more.component.css']
})
export class LoadMoreComponent implements OnInit {

  @Output()
  onLoadMore = new EventEmitter<any>();

  @Input()
  status = LoadStatus.GONE;

  constructor() {
  }

  ngOnInit() {
  }

  private loadMore() {
    this.status = LoadStatus.LOADING;
    this.onLoadMore.emit();
  }
}

