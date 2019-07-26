import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {MainComponent} from './main/main.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {PostListComponent} from './post/post-list/post-list.component';

const router: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: '', component: MainComponent,
    children: [
      {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'posts', component: PostListComponent}
    ]
  }
];

export const appRouting = RouterModule.forRoot(router);
