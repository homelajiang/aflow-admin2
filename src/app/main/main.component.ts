import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MainMenu} from '../entry';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private router: Router) {
  }

  mainMenu: Array<MainMenu> = [];

  ngOnInit() {
    this.mainMenu = this.generateDefaultMenu();
  }

  newPost() {
    this.router.navigate(['post/new']);
  }

  private navClick(router: string) {
    this.router.navigate([router]);
  }


  private generateDefaultMenu(): Array<MainMenu> {
    const menus: Array<MainMenu> = [];

    menus.push(new MainMenu('DASHBOARD', 'panorama_fish_eye', '/dashboard'));
    menus.push(new MainMenu('POSTS', 'panorama_fish_eye', '/post'));
    menus.push(new MainMenu('COMMENTS', 'panorama_fish_eye', '/comment'));
    menus.push(new MainMenu('CATEGORIES', 'panorama_fish_eye', 'categories'));
    menus.push(new MainMenu('TAGS', 'panorama_fish_eye', '/tag'));
    menus.push(new MainMenu('TEMPLATE', 'panorama_fish_eye', ''));
    menus.push(new MainMenu('SETTINGS', 'panorama_fish_eye', ''));

    return menus;
  }

}
