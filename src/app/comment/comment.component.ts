import {Component, OnInit} from '@angular/core';
import {Comment, LoadStatus, PageModel} from '../entry';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {BlogService} from '../blog/blog.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackBar} from '../utils/snack-bar';
import {MatButtonToggleChange} from '@angular/material/button-toggle';
import {filter, switchMap} from 'rxjs/operators';
import {ConfirmDialogComponent} from '../component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  private loadingStatus: number;
  private searchText: string;
  private page = 1;
  private type = 'review'; // 0 发布 1 待审核 -1 删除
  private postId: string;

  comments: Array<Comment> = [];

  constructor(private dialog: MatDialog, private blogService: BlogService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getDataList(true);
  }

  private getDataList(refresh: boolean) {
    this.loadingStatus = LoadStatus.LOADING;
    if (refresh) {
      this.page = 1;
    }
    this.blogService.getComments(this.page, this.type, this.searchText, this.postId)
      .subscribe((commentPage: PageModel<Comment>) => {
        this.page++;
        if (refresh) {
          this.comments = commentPage.list;
        } else {
          this.comments = this.comments.concat(commentPage.list);
        }
        commentPage.hasNextPage ? this.loadingStatus = LoadStatus.LOAD_MORE :
          this.loadingStatus = LoadStatus.NO_MORE;
      }, error => {
        SnackBar.open(this.snackBar, error);
        this.loadingStatus = LoadStatus.LOAD_MORE;
      });
  }

  private onLoadMore() {
    this.getDataList(false);
  }

  restoreComment(comment: Comment, index: number) {
    this.updateComment(comment, index, 'review');
  }

  reviewComment(comment: Comment, index: number) {
    this.updateComment(comment, index, 'published');
  }

  removeComment(comment: Comment, index: number) {
    if (comment.status === 'deleted') {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        minWidth: '360px',
        data: {
          content: '是否永久删除该评论，删除后将不可恢复。',
          color: 'warn'
        }
      });

      dialogRef.afterClosed()
        .pipe(
          filter(event => {
            return event;
          }),
          switchMap(() => {
            return this.blogService.removeComment(comment.id);
          })
        )
        .subscribe(
          res => this.comments.splice(index, 1),
          error => SnackBar.open(this.snackBar, error)
        );
    } else {
      const dialogRef = this.dialog.open(CommentRemoveDialogComponent, {
        minWidth: '360px',
      });

      dialogRef.afterClosed()
        .pipe(
          filter(event => {
            return event;
          }),
          switchMap(reason => {
            const tempComment: Comment = JSON.parse(JSON.stringify(comment));
            tempComment.status = 'deleted';
            tempComment.deleteReason = reason;
            return this.blogService.updateComment(tempComment);
          })
        )
        .subscribe(
          res => this.comments.splice(index, 1),
          error => SnackBar.open(this.snackBar, error));
    }
  }

  replyComment(comment: Comment, index: number) {
    SnackBar.open(this.snackBar, '暂未开放');
  }

  /**
   * 更新评论信息
   * @param comment 评论信息
   * @param index the comment index
   * @param status the comment update to status
   */
  private updateComment(comment: Comment, index: number, status: string) {
    const tempComment: Comment = JSON.parse(JSON.stringify(comment));
    tempComment.status = status;
    tempComment.deleteDate = '';
    this.blogService.updateComment(tempComment)
      .subscribe(res => {
          this.comments.splice(index, 1);
          let message: string;
          if (status === 'deleted') {
            message = '删除成功';
          } else if (status === 'published') {
            message = '审核通过';
          } else if (status === 'review') {
            message = '恢复成功';
          }
          SnackBar.open(this.snackBar, message);
        },
        error => SnackBar.open(this.snackBar, error));
  }

  onSearch(keyword: string) {
    this.searchText = keyword;
    this.getDataList(true);
  }

  onChangeType(event: MatButtonToggleChange) {
    this.type = event.value;
    this.getDataList(true);
  }
}

@Component({
  selector: 'app-comment-remove-dialog',
  templateUrl: './comment-remove-dialog.component.html',
  styleUrls: ['./comment-remove-dialog.component.css']
})
export class CommentRemoveDialogComponent implements OnInit {
  selectReason: string;
  otherReason: string;
  reasons: string[] = ['广告推广', '血腥暴力', '色情内容', '其他'];

  constructor(public snackBar: MatSnackBar, public dialogRef: MatDialogRef<CommentRemoveDialogComponent>) {
  }

  ngOnInit(): void {
  }

  closeDialog() {
    if (!this.selectReason) {
      SnackBar.open(this.snackBar, '请选择一种原因');
      return;
    }
    if (this.selectReason === '其他' && !this.otherReason) {
      SnackBar.open(this.snackBar, '请输入原因');
      return;
    }

    if (this.selectReason === '其他') {
      this.dialogRef.close(this.otherReason);
    } else {
      this.dialogRef.close(this.selectReason);
    }

  }


}

