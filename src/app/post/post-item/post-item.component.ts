import {Component, Input, OnInit} from '@angular/core';
import {Post} from '../../entry';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit {

  @Input()
  post: Post;

  constructor() {
  }

  ngOnInit() {
  }

  editPost(post: Post) {
  }

  previewPost(post: Post) {
  }

  // top  or cancel top the post
  switchTop(post: Post) {
  }

  sharePost(post: Post) {

  }

  updatePost(post: Post, status: number) {

  }

  removePost(post: Post) {

  }
}
