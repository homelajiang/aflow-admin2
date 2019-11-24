import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LoadStatus, Media, MediaWrapper, PageModel} from '../entry';
import {MatDialog, MatSnackBar} from '@angular/material';
import {BlogService} from '../blog/blog.service';
import {SnackBar} from '../utils/snack-bar';
import {MediaInfoComponent} from './media-info/media-info.component';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
export class MediaComponent implements OnInit {

  /** View or select */
  @Input()
  selectMode: boolean;

  /** single select or multiple select */
  @Input()
  selectMultiple: boolean;

  @Output()
  selectMedia = new EventEmitter<Array<Media>>();

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

    // 监听更新事件
    this.blogService.updateMediaMessage
      .subscribe((mediaWrapper: MediaWrapper) => {
        if (mediaWrapper && mediaWrapper.index >= 0) {
          this.medias[mediaWrapper.index] = mediaWrapper.media;
        }
      });

    // 监听删除事件
    this.blogService.deleteMediaMessage
      .subscribe((index: number) => {
        if (index === -1) {
          return;
        }
        this.medias.splice(index, 1);
      });

    // 监听加载更多成功时间
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


  private onMediaClick(media, index) {
    if (this.selectMode) {
      if (this.selectMultiple) {
        media.selected = !media.selected;

        this.selectMedia.emit(this.getSelectMedias());
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
          this.selectMedia.emit(tempList);
        } else {
          this.preSelectMedia = null;
          this.selectMedia.emit([]);
        }
      }
    } else {
      this.showMediaDialog(index);
    }
  }

  private showMediaDialog(index) {
    // const dialogRef
    this.dialog.open(MediaInfoComponent, {
      maxWidth: '100vw',
      width: '100vw',
      height: '100vh',
      panelClass: 'transparent-dialog',
      data: {index, medias: this.medias}
    });
    // dialogRef.afterClosed()
    //   .pipe(
    //     filter(res => res)
    //   )
    //   .subscribe(res => {
    //     this.medias[index] = res;
    //   });
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
