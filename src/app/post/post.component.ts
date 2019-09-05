import {Component, OnInit} from '@angular/core';
import {LoadStatus, PageModel, Post} from '../entry';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BlogService} from '../blog/blog.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }


}
