import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Media} from '../../entry';

@Component({
  selector: 'app-media-info',
  templateUrl: './media-info.component.html',
  styleUrls: ['./media-info.component.css']
})
export class MediaInfoComponent implements OnInit {
  private media: Media;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.media = data.media;
  }

  ngOnInit() {
  }

}
