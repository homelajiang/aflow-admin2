import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
export class MediaComponent implements OnInit {

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
  }


  onMediaClick(media) {
    const dialogRef = this.dialog.open(MediaInfoDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result: ${result}');
    });
  }

}

@Component({
  selector: 'app-media-info-dialog',
  templateUrl: 'media-info-dialog.html'
})
export class MediaInfoDialogComponent {
}
