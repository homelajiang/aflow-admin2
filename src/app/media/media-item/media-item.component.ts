import {Component, Input, OnInit} from '@angular/core';
import {Media} from '../../entry';

@Component({
  selector: 'app-media-item',
  templateUrl: './media-item.component.html',
  styleUrls: ['./media-item.component.css']
})
export class MediaItemComponent implements OnInit {

  @Input()
  media: Media;

  constructor() {
  }

  ngOnInit() {
  }

}
