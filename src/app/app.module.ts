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
  MatListModule, MatOptionModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule,
  MatSidenavModule, MatSlideToggleModule,
  MatToolbarModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {PostDashboardItemComponent} from './post/post-dashboard-item/post-dashboard-item.component';
import {PostListComponent} from './post/post-list/post-list.component';
import {PostItemComponent} from './post/post-item/post-item.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {appRouting} from './app.router';
import {LoginComponent} from './login/login.component';
import {MainComponent} from './main/main.component';
import {PostEditComponent} from './post/post-edit/post-edit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MediaComponent} from './media/media.component';
import {MediaItemComponent} from './media/media-item/media-item.component';
import {MarkdownComponent} from './markdown/markdown.component';
import {CommentComponent} from './comment/comment.component';
import {CreateTagDialogComponent, TagComponent} from './tag/tag.component';
import {Code404Component} from './error/code404/code404.component';
import {httpInterceptorProviders} from './http-interceptor';
import {HttpClientModule} from '@angular/common/http';
import {MediaUploadComponent} from './media/media-upload/media-upload.component';
import {ClipboardModule} from 'ngx-clipboard';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {PostInsertImageComponent} from './post/post-insert-image/post-insert-image.component';
import {Subscription} from 'rxjs';
import * as prettyBytes from 'pretty-bytes';
import {SearchBarComponent} from './component/search-bar/search-bar.component';
import {MediaListComponent} from './media/media-list/media-list.component';
import {MediaInfoComponent} from './media/media-info/media-info.component';
import {PostComponent} from './post/post.component';
import {LoadingComponent} from './component/loading/loading.component';
import {LoadMoreComponent} from './component/load-more/load-more.component';
import {UploadButtonComponent} from './component/upload-button/upload-button.component';
import {ImageCropComponent} from './component/image-crop/image-crop.component';
import {ImageCropperModule} from 'ngx-img-cropper';
import {ImageCropDialogComponent} from './component/image-crop-dialog/image-crop-dialog.component';
import {ConfirmDialogComponent} from './component/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    PostDashboardItemComponent,
    PostListComponent,
    PostItemComponent,
    DashboardComponent,
    LoginComponent,
    MainComponent,
    PostEditComponent,
    MediaComponent,
    MediaItemComponent,
    MarkdownComponent,
    CommentComponent,
    TagComponent,
    Code404Component,
    MediaUploadComponent,
    PostInsertImageComponent,
    SearchBarComponent,
    MediaListComponent,
    MediaInfoComponent,
    PostComponent,
    LoadingComponent,
    LoadMoreComponent,
    UploadButtonComponent,
    CreateTagDialogComponent,
    ImageCropComponent,
    ImageCropDialogComponent,
    ConfirmDialogComponent,
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
    MatTabsModule,
    MatProgressSpinnerModule,
    ImageCropperModule
  ],
  entryComponents: [MediaInfoComponent, CreateTagDialogComponent,
    ImageCropDialogComponent, ConfirmDialogComponent],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {
}
