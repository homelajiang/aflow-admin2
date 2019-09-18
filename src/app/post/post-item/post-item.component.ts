import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Post } from '../../entry';
import { BlogService } from 'src/app/blog/blog.service';
import { SnackBar } from 'src/app/utils/snack-bar';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/component/confirm-dialog/confirm-dialog.component';
import { filter, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit {

  @Input()
  post: Post;
  @Input()
  index: number;

  @Output()
  remove = new EventEmitter();

  constructor(public blogServer: BlogService, public snackbar: MatSnackBar,
    private dialog: MatDialog, private router: Router) {
  }

  ngOnInit() {
  }

  editPost() {
    this.router.navigate(['post/edit', this.post.id]);
  }

  previewPost() {
  }

  // top  or cancel top the post
  switchTop() {
    this.blogServer.updatePost(
      { stick: !this.post.stick },
      this.post.id
    )
      .subscribe((p) => {
        this.post.stick = !this.post.stick;
      }, err => {
        SnackBar.open(this.snackbar, '置顶失败');
      });
  }

  sharePost() {

  }

  updateStatus(status: number) {
    this.blogServer.updatePost(
      { status },
      this.post.id)
      .subscribe((p) => {
        this.remove.emit(this.index);
      }, err => {
        SnackBar.open(this.snackbar, '操作失败');
      });
  }

  removePost() {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        content: '是否永久删除该文章？',
        color: 'warn'
      }
    })
      .afterClosed()
      .pipe(
        filter(event => {
          return event;
        }),
        switchMap(() => {
          return this.blogServer.removePost(this.post.id);
        })
      )
      .subscribe(res => {
        this.remove.emit(this.index);
      }, err => SnackBar.open(this.snackbar, '删除失败'));
  }
}
