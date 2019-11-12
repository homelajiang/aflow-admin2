import {Subscription} from 'rxjs';
import * as prettyBytes from 'pretty-bytes';

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
  selected: boolean;
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

export class Categories {
  id: string;
  name: string;
  alias: string;
  image: string;
  description: string;
}

export class Post {
  id;
  title = '未命名文章';
  description;
  content;
  createDate;
  modifyDate;
  publishDate;
  cover;
  top;
  open = 'public';
  password;
  openComment = true;
  needReview = false;
  status = 'draft';
  categories: Categories = null;
  tags: string[] = [];
  views: number; // 浏览数
  comments: number; // 评论数
}

export class Comment {
  id: string;
  status: string;
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

export class MediaStorage {
  used: string;
  total: string;
  percent: number;
  count: number;
  picture: number;
  music: number;
  video: number;
  other: number;
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

export class LoadStatus {
  public static GONE = 0;
  public static LOAD_MORE = 1;
  public static LOADING = 2;
  public static NO_MORE = 3;
}

export class MediaWrapper {
  index = -1;
  media: Media;

  constructor() {
  }

}

export class MainMenu {
  name: string;
  color: string;
  tips: string;
  unread: number;
  icon: string;
  router: string;


  public constructor(name: string, icon: string, router: string,
                     color?: string, tips?: string, unread?: number) {
    this.name = name;
    this.icon = icon;
    this.router = router;
    if (color) {
      this.color = color;
    }
    if (tips) {
      this.tips = tips;
    }
    if (unread) {
      this.unread = unread;
    }
  }
}
