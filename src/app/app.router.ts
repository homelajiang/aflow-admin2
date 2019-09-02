import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {MainComponent} from './main/main.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {PostListComponent} from './post/post-list/post-list.component';
import {PostEditComponent} from './post/post-edit/post-edit.component';
import {MediaComponent} from './media/media.component';
import {CommentComponent} from './comment/comment.component';
import {TagComponent} from './tag/tag.component';
import {CategoriesComponent} from './categories/categories.component';
import {Code404Component} from './error/code404/code404.component';
import {AuthGuard} from './auth/auth.guard';
import {MediaUploadComponent} from './media/media-upload/media-upload.component';
import {PostInsertImageComponent} from './post/post-insert-image/post-insert-image.component';

const router: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: '', component: MainComponent, canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'post', component: PostListComponent},
      {path: 'post/edit', component: PostEditComponent},
      {path: 'comment', component: CommentComponent},
      {path: 'tag', component: TagComponent},
      {path: 'media', component: MediaComponent},
      {path: 'file', component: MediaUploadComponent},
      {path: 'file/dialog', component: PostInsertImageComponent},
      {path: 'categories', component: CategoriesComponent}
    ]
  },
  {path: '**', component: Code404Component}
];

export const appRouting = RouterModule.forRoot(router);
