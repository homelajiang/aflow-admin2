import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MediaInfoComponent} from '../media-info/media-info.component';

@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.css']
})
export class MediaListComponent implements OnInit {

  /** View or select */
  @Input()
  selectMode: boolean;

  /** single select or multiple select */
  @Input()
  selectMultiple: boolean;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
  }


  onMediaClick(media) {
    const dialogRef = this.dialog.open(MediaInfoComponent, {
      width: 'calc(100vw - 60px)',
      maxWidth: '100vw',
      height: 'calc(100vh - 60px)'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result: ${result}');
    });
  }

}

