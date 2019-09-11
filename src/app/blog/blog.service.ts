import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {Comment, Auth, Categories, Media, PageModel, Tag, Post, FileUploadModel} from '../entry';
import {catchError, last, map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  defaultHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // 登录成功后需要跳转的url
  redirectUrl: string;

  constructor(private http: HttpClient, private router: Router) {

  }

  login(username: string, password: string): Observable<Auth> {
    return this.http.post('api/v1/login',
      {
        username,
        password
      }, this.defaultHttpOptions)
      .pipe(
        tap((auth: Auth) => {
          if (auth.accessToken) {
            saveAccessToken(auth);
            // TODO 跳转存储的url，并重置redirectUrl
          }
        })
      );
  }

  logout(): void {
    removeAccessToken();
  }

  uploadFile(file: File): Observable<any> {
    const fd = new FormData();
    fd.append('file', file);

    const req = new HttpRequest('POST', 'api/v1/file', fd, {reportProgress: true});

    return this.http.request(req)
      .pipe(
        last()
      );
  }

  uploadFileModel(file: FileUploadModel): Observable<any> {
    const fd = new FormData();
    fd.append('file', file.data);

    const req = new HttpRequest('POST', 'api/v1/file', fd, {reportProgress: true});
    file.inProgress = true;
    return this.http.request(req)
      .pipe(
        map(event => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              file.progress = Math.round(event.loaded * 100 / event.total);
              break;
            case HttpEventType.Response:
              return event;
          }
        }),
        tap(message => {
        }),
        last(),
        catchError((err: HttpErrorResponse) => {
          file.inProgress = false;
          file.canRetry = true;
          file.status = -1;
          return of(`${file.data.name} upload failed.`);
        })
      );
  }

  getMedias(page: number, keyword?: string): Observable<PageModel<Media>> {
    let params: HttpParams = new HttpParams()
      .set('pageSize', '20')
      .set('pageNum', page.toString());
    if (keyword && keyword.trim()) {
      params = params.set('keyword', keyword.trim());
    }
    return this.http.get<PageModel<Media>>('api/v1/file', {params});
  }

  updateMedia(id: string, media: Media): Observable<Media> {
    return this.http.post<Media>(`api/v1/file/${id}`,
      {
        name: media.name,
        description: media.description
      },
      this.defaultHttpOptions);
  }


  createCategories(categories: Categories): Observable<Categories> {
    return this.http.post<Categories>(`api/v1/categories`, categories, this.defaultHttpOptions);
  }

  removeCategories(id: string): Observable<{}> {
    return this.http.delete(`api/v1/categories/${id}`);
  }

  updateCategories(categories: Categories): Observable<Categories> {
    return this.http.post<Categories>(`api/v1/categories/${categories.id}`, categories, this.defaultHttpOptions);
  }

  getCategories(page: number, pageSize: number, keyword?: string): Observable<PageModel<Categories>> {
    let params: HttpParams = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageNum', page.toString());
    if (keyword && keyword.trim()) {
      params = params.set('key', keyword.trim());
    }
    return this.http.get<PageModel<Categories>>(`api/v1/categories`, {params});
  }

  getCategoriesInfo(id: string): Observable<Categories> {
    return this.http.get <Categories>(`api/v1/categories/${id}`);
  }


  createTag(tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(`api/v1/tag`, tag, this.defaultHttpOptions);
  }

  removeTag(id: string): Observable<{}> {
    return this.http.delete(`api/v1/tag/${id}`);
  }

  updateTag(tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(`api/v1/tag/${tag.id}`, tag, this.defaultHttpOptions);
  }

  getTags(page: number, keyword?: string): Observable<PageModel<Tag>> {
    let params: HttpParams = new HttpParams()
      .set('pageSize', '10')
      .set('pageNum', page.toString());

    if (keyword && keyword.trim()) {
      params = params.set('key', keyword.trim());
    }
    return this.http.get<PageModel<Tag>>(`api/v1/tag`, {params});
  }

  getTagInfo(id: string): Observable<Tag> {
    return this.http.get<Tag>(`api/v1/tag/${id}`);
  }

  removeComment(id: string): Observable<{}> {
    return this.http.delete(`api/v1/comment/${id}`);
  }

  updateComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`api/v1/comment/${comment.id}`, comment, this.defaultHttpOptions);
  }

  getComments(page: number, pageSize: number, type: string, keyword: string, postId: string): Observable<PageModel<Comment>> {
    let params: HttpParams = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageNum', page.toString());

    if (keyword && keyword.trim()) {
      params = params.set('key', keyword.trim());
    }

    if (postId) {
      params = params.set('post_id', postId);
    }

    if (type === '0' || type === '1' || type === '-1') {
      params = params.set('type', type.toString());
    }
    return this.http.get<PageModel<Comment>>('api/v1/comment', {params});
  }


  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(`api/v1/post`, post, this.defaultHttpOptions);
  }

  removePost(id: string): Observable<{}> {
    return this.http.delete(`api/v1/post/${id}`);
  }

  updatePost(post: Post): Observable<Post> {
    return this.http.post<Post>(`api/v1/post/${post.id}`, post, this.defaultHttpOptions);
  }

  getPosts(page: number, type: string, keyword?: string): Observable<PageModel<Post>> {
    let params: HttpParams = new HttpParams()
      .set('pageSize', '10')
      .set('pageNum', page.toString());

    if (keyword && keyword.trim()) {
      params = params.set('key', keyword.trim());
    }

    if (type === '0' || type === '1' || type === '-1') {
      params = params.set('type', type);
    }

    return this.http.get<PageModel<Post>>(`api/v1/post`, {params});
  }

  getPostInfo(id: string): Observable<Post> {
    return this.http.get<Post>(`api/v1/post/${id}`);
  }

  getTodo(page: number): Observable<PageModel<any>> {
    return this.http.get<PageModel<any>>(`api/v1/todos`);
  }

  getStatistics(): Observable<any> {
    return this.http.get('api/v1/statistics');
  }

  getPostStatistics(sortBy: string, sortRang: string): Observable<any> {
    const params: HttpParams = new HttpParams()
      .set('sort_by', sortBy)
      .set('sort_rang', sortRang);
    return this.http.get(`api/v1/statistics/post`, {params});
  }

  checkLogin() {
    return checkAccessToken();
  }
}

function checkAccessToken() {
  // TODO check token
  return true;
}

function saveAccessToken(auth: Auth) {
  localStorage.setItem('accessToken', auth.accessToken);
}

function removeAccessToken() {
  localStorage.removeItem('accessToken');
}
