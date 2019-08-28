import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {BlogService} from '../blog/blog.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private blogService: BlogService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  private checkLogin(url: string): boolean {
    if (this.blogService.checkLogin()) {
      return true;
    }

    // Store the attempted URL for redirecting
    this.blogService.redirectUrl = url;
    this.router.navigate(['/login']);
    return false;
  }

}
