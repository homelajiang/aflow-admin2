import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MediaInfoComponent} from '../media-info/media-info.component';
import {BlogService} from '../../blog/blog.service';
import {LoadStatus, Media, PageModel} from '../../entry';
import {MatSnackBar} from '@angular/material';
import {SnackBar} from '../../utils/snack-bar';

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

  @Output()
  selectMediaEvent = new EventEmitter<Array<Media>>();

  private searchText: string;

  /*  loading bar status*/
  private loadingStatus: number;

  /*the last selected media in single select mode*/
  private preSelectMedia: Media;

  private page = 1;
  private medias: Array<Media> = [];

  constructor(private  dialog: MatDialog, private  blogService: BlogService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getMedias(true);
  }

  private getMedias(refresh: boolean) {
    this.loadingStatus = LoadStatus.LOADING;
    if (refresh) {
      this.page = 1;
    }
    this.blogService.getMedias(this.page, this.searchText)
      .subscribe((mediasPage: PageModel<Media>) => {
        this.page++;
        if (refresh) {
          this.medias = mediasPage.list;
        } else {
          this.medias = this.medias.concat(mediasPage.list);
        }

        mediasPage.hasNextPage ? this.loadingStatus = LoadStatus.LOAD_MORE :
          this.loadingStatus = LoadStatus.NO_MORE;

      }, error => {
        SnackBar.open(this.snackBar, error);
        this.loadingStatus = LoadStatus.LOAD_MORE;
      });
  }


  private onMediaClick(media) {
    if (this.selectMode) {
      if (this.selectMultiple) {
        media.selected = !media.selected;

        this.selectMediaEvent.emit(this.getSelectMedias());
      } else { // single select mode
        media.selected = !media.selected;
        // remove other selected item status
        if (this.preSelectMedia && this.preSelectMedia !== media) {
          this.preSelectMedia.selected = false;
        }

        if (media.selected) {
          this.preSelectMedia = media;
          const tempList = [];
          tempList.push(media);
          this.selectMediaEvent.emit(tempList);
        } else {
          this.preSelectMedia = null;
          this.selectMediaEvent.emit([]);
        }
      }
    } else {
      this.showMediaDialog(media);
    }
  }

  private showMediaDialog(media: Media) {
    const dialogRef = this.dialog.open(MediaInfoComponent, {
      width: 'calc(100vw - 60px)',
      maxWidth: '100vw',
      height: 'calc(100vh - 60px)',
      data: {media}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result: ${result}');
    });
  }

  private onLoadMore() {
    this.getMedias(false);
  }

  private getSelectMedias(): Array<Media> {
    const temp: Array<Media> = [];
    this.medias.forEach((media: Media) => {
      if (media.selected) {
        temp.push(media);
      }
    });
    return temp;
  }

  searchByWord(keyword: string) {
    this.searchText = keyword;
    this.getMedias(true);
  }

  addMedia(media: Media) {
    this.medias.unshift(media);
  }

}

