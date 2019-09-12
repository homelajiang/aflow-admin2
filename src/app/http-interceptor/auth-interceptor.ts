import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BlogService} from '../blog/blog.service';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private blogService: BlogService, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        // retry(1),
        catchError((err: HttpErrorResponse) => {
          let errorMessage = '';
          if (err.error instanceof ErrorEvent) {
            // client-size error
            errorMessage = err.error.message;
          } else {
            // server-side error
            errorMessage = err.error.message;
            // errorMessage = err.message;
            if (err.status === 401) {
              this.router.navigateByUrl(`/login`);
              this.blogService.logout();
            }
          }
          return throwError(errorMessage);
        })
      );
  }

}
