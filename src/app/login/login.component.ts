import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {SnackBar} from '../utils/snack-bar';
import {BlogService} from '../blog/blog.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;

  logging = false;

  constructor(private snackBar: MatSnackBar, private blogService: BlogService, private router: Router) {
  }

  ngOnInit() {
  }

  login() {
    if (!this.username) {
      SnackBar.open(this.snackBar, '用户名能为空');
      return;
    }

    if (!this.password) {
      SnackBar.open(this.snackBar, '用户密码不能为空');
      return;
    }

    this.logging = true;

    this.blogService.login(this.username, this.password)
      .subscribe(auth => {
        this.logging = false;
      }, err => {
        this.logging = false;
        SnackBar.open(this.snackBar, err);
      });
  }

}
