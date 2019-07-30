import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatBadgeModule,
  MatButtonModule, MatCardModule, MatCheckboxModule,
  MatChipsModule, MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatListModule, MatOptionModule, MatRadioModule, MatSelectModule,
  MatSidenavModule, MatSlideToggleModule,
  MatToolbarModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {PostDashboardItemComponent} from './post/post-dashboard-item/post-dashboard-item.component';
import {PostListComponent} from './post/post-list/post-list.component';
import {PostListItemComponent} from './post/post-list-item/post-list-item.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {appRouting} from './app.router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { PostEditComponent } from './post/post-edit/post-edit.component';

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
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
