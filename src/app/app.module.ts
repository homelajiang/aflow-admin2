import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule,
  MatChipsModule, MatDialogModule, MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatListModule, MatOptionModule, MatProgressBarModule, MatRadioModule, MatSelectModule,
  MatSidenavModule, MatSlideToggleModule,
  MatToolbarModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {PostDashboardItemComponent} from './post/post-dashboard-item/post-dashboard-item.component';
import {PostListComponent} from './post/post-list/post-list.component';
import {PostListItemComponent} from './post/post-list-item/post-list-item.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {appRouting} from './app.router';
import {LoginComponent} from './login/login.component';
import {MainComponent} from './main/main.component';
import {PostEditComponent} from './post/post-edit/post-edit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MediaComponent, MediaInfoDialogComponent} from './media/media.component';
import {MediaItemComponent} from './media/media-item/media-item.component';
import {MarkdownComponent} from './markdown/markdown.component';
import {CommentComponent} from './comment/comment.component';
import {TagComponent} from './tag/tag.component';
import {CategoriesComponent} from './categories/categories.component';
import {Code404Component} from './error/code404/code404.component';
import {httpInterceptorProviders} from './http-interceptor';
import {HttpClientModule} from '@angular/common/http';
import {MediaUploadComponent} from './media/media-upload/media-upload.component';
import {ClipboardModule} from 'ngx-clipboard';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import { PostInsertImageComponent } from './post/post-insert-image/post-insert-image.component';
import {Subscription} from 'rxjs';
import * as prettyBytes from 'pretty-bytes';

@NgModule({
  declarations: [
    AppComponent,
    PostDashboardItemComponent,
    PostListComponent,
    PostListItemComponent,
    DashboardComponent,
    LoginComponent,
    MainComponent,
    PostEditComponent,
    MediaComponent,
    MediaItemComponent,
    MediaInfoDialogComponent,
    MarkdownComponent,
    CommentComponent,
    TagComponent,
    CategoriesComponent,
    Code404Component,
    MediaUploadComponent,
    PostInsertImageComponent,
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule,
    MatCardModule,
    appRouting,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatButtonToggleModule,
    FormsModule,
    HttpClientModule,
    MatProgressBarModule,
    ClipboardModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTabsModule
  ],
  entryComponents: [MediaInfoDialogComponent],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export interface PageModel<T> {
  hasNextPage: boolean;
  pageSize: number;
  pageNum: number;
  count: number;
  list: Array<T>;
}

export class Media {
  id: string;
  name: string;
  path: string;
  description: string;
  mimeType: string;
  createDate: string;
  modifyDate: string;
}

export class Profile {
  id: string;
  username: string;
  nickname: string;
  userImg: string;
  gender: number;
  email: string;
  signature: string;
  confirmed: boolean;
  lastLoginDate: string;
  joinDate: string;
  mobile: string;
  status: number;
  role: number;
}

export class Tag {
  id: string;
  name: string;
  alias: string;
  image: string;
  description: string;
  color: string;
}

export class Categories {
  id: string;
  name = '未分类';
  alias: string;
  image: string;
  description: string;
}

export class Post {
  id = '';
  title = '';
  description = '';
  content = '';
  createDate = '';
  modifyDate = '';
  publishDate = '';
  cover = null;
  stick = false;
  open = 0;
  password = '';
  openComment = true;
  needReview = false;
  status = 0;
  categories = null;
  tags: Tag[] = [];
}

export class Comment {
  id: string;
  status: number;
  content: string;
  creator: Creator;
  createDate: string;
  post: Post;
  deleteDate: string;
  deleteReason: string;

}

export class Creator {
  name: string;
  email: string;
  host: string;
  img: string;
}

export class Auth {
  accessToken: string;
  // token_type: string;
  // epires_in: number;
  // refresh_token: string;
}

export class FileUploadModel {
  /** upload status  0 uploading , -1 upload error , 1 upload success */
  status: number;
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub?: Subscription;
  result: any;

  constructor(file: File) {
    this.data = file;
    this.state = 'in';
    this.inProgress = false;
    this.progress = 0;
    this.canRetry = false;
    this.canCancel = true;
  }


  public getDisplayName(): string {
    if (this.data) {
      return this.data.name;
    }
    return '';
  }

  public getDisplayOther(): string {
    if (this.data) {
      return prettyBytes(this.data.size);
    }
    return '';
  }
}
